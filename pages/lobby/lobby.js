const { GAMES } = require('../../utils/games')

Page({
  data: {
    room: { code: '', players: [], hostId: '', roomId: '' },
    isHost: false,
    selectedGame: null,
    gameList: [],
    emptySlots: [],
    watchStop: null
  },

  onLoad(options) {
    const user = wx.getStorageSync('user')
    const roomId = options.roomId
    if (!user || !roomId) { wx.redirectTo({ url: '/pages/register/register' }); return }

    const list = GAMES.map(g => ({ id: g.id, name: g.name, icon: g.icon }))
    this.setData({ gameList: list, 'room.roomId': roomId, 'room.hostId': user.hostId })

    // 先从本地读取房间
    this.loadRoom(roomId, user)

    // 监听云数据库实时变化
    this.startWatching(roomId)
  },

  onUnload() {
    // 停止云监听
    if (this.data.watchStop) {
      this.data.watchStop()
    }
  },

  loadRoom(roomId, user) {
    let myRooms = wx.getStorageSync('myRooms') || []
    let room = myRooms.find(r => r.roomId === roomId)
    if (!room) {
      // 可能是从分享进来的，创建临时房间
      room = { roomId, code: '****', players: [], hostId: '', status: 'waiting', currentGame: null }
      myRooms.push(room)
      wx.setStorageSync('myRooms', myRooms)
    }
    this.setData({
      room,
      isHost: user.id === room.hostId
    })
    this.updateEmptySlots(room.players.length)
  },

  // 实时监听云数据库
  startWatching(roomId) {
    if (!wx.cloud) return
    const db = wx.cloud.database()
    const watcher = db.collection('rooms').doc(roomId).watch({
      onChange: (snapshot) => {
        if (snapshot.type === 'init' || snapshot.type === 'update') {
          const doc = snapshot.docs && snapshot.docs[0]
          if (doc) {
            const user = wx.getStorageSync('user')
            const isHost = user.id === doc.hostId

            // 如果房间状态变为playing，跳转到游戏页
            if (doc.status === 'playing' && doc.currentGame) {
              wx.redirectTo({
                url: '/pages/game/game?gameId=' + doc.currentGame + '&roomId=' + roomId
              })
              return
            }

            this.setData({
              room: doc,
              isHost
            })
            this.updateEmptySlots(doc.players.length)

            // 更新本地缓存
            let myRooms = wx.getStorageSync('myRooms') || []
            const idx = myRooms.findIndex(r => r.roomId === roomId)
            if (idx >= 0) myRooms[idx] = doc
            else myRooms.unshift(doc)
            wx.setStorageSync('myRooms', myRooms)
          }
        }
      },
      onError: (err) => {
        console.log('实时监听出错:', err)
      }
    })
    this.setData({ watchStop: () => watcher.close() })
  },

  updateEmptySlots(count) {
    const max = 10
    const empty = Math.max(0, max - count)
    this.setData({ emptySlots: Array.from({ length: empty }, (_, i) => i) })
  },

  // 微信分享
  onShareAppMessage() {
    const room = this.data.room
    return {
      title: '💕 情侣升温游戏邀请你加入',
      path: '/pages/register/register?roomId=' + room.roomId,
      imageUrl: '' // 可设分享图
    }
  },

  shareRoom() {
    // 触发转发菜单
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage'] })
  },

  // 选择游戏
  selectGame(e) {
    this.setData({ selectedGame: e.currentTarget.dataset.id })
  },

  // 房主开始游戏
  startGame() {
    const { room, selectedGame } = this.data
    if (room.players.length < 2) {
      wx.showToast({ title: '至少需要2位玩家', icon: 'none' })
      return
    }
    if (!selectedGame) {
      wx.showToast({ title: '请选择一个游戏', icon: 'none' })
      return
    }

    // 更新云数据库状态为playing
    if (wx.cloud) {
      const db = wx.cloud.database()
      db.collection('rooms').doc(room.roomId).update({
        data: {
          status: 'playing',
          currentGame: selectedGame
        }
      }).then(() => {
        // 同时跳转
        wx.redirectTo({
          url: '/pages/game/game?gameId=' + selectedGame + '&roomId=' + room.roomId
        })
      }).catch(err => {
        console.log('开始游戏失败:', err)
        wx.showToast({ title: '开始失败，请重试', icon: 'none' })
      })
    } else {
      // 无云开发，直接本地跳转
      wx.redirectTo({
        url: '/pages/game/game?gameId=' + selectedGame + '&roomId=' + room.roomId
      })
    }
  }
})
