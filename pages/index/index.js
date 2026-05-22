const { GAMES } = require('../../utils/games')

Page({
  data: {
    user: {},
    joinCode: '',
    myRooms: [],
    gameList: []
  },

  onLoad() {
    const user = wx.getStorageSync('user')
    if (!user || !user.nickname) {
      wx.redirectTo({ url: '/pages/register/register' })
      return
    }
    const list = GAMES.map(g => ({ id: g.id, name: g.name, icon: g.icon }))
    this.setData({ user, gameList: list })
    this.loadMyRooms()
  },

  onShow() {
    this.loadMyRooms()
  },

  // 加载我的房间列表
  loadMyRooms() {
    const rooms = wx.getStorageSync('myRooms') || []
    this.setData({ myRooms: rooms })
  },

  // 单人模式 —— 直接进入游戏
  goSolo() {
    wx.navigateTo({ url: '/pages/game/game?mode=solo' })
  },

  // 创建房间
  createRoom() {
    const user = this.data.user
    const code = String(Math.floor(1000 + Math.random() * 9000))
    const roomId = 'room_' + Date.now()
    const room = {
      roomId,
      code,
      hostId: user.id,
      hostName: user.nickname,
      players: [{ ...user }],
      playerCount: 1,
      status: 'waiting',
      currentGame: null,
      gameState: null,
      createTime: Date.now()
    }

    let myRooms = wx.getStorageSync('myRooms') || []
    myRooms.unshift(room)
    wx.setStorageSync('myRooms', myRooms)
    wx.setStorageSync('currentRoom', room)

    this.syncRoomToCloud(room)
    this.setData({ myRooms })
    wx.navigateTo({ url: '/pages/lobby/lobby?roomId=' + roomId })
  },

  // 同步房间到云数据库
  syncRoomToCloud(room) {
    if (!wx.cloud) return
    const db = wx.cloud.database()
    db.collection('rooms').doc(room.roomId).set({
      data: { ...room, _openid: '{openid}' }
    }).catch(err => {
      console.log('云同步失败:', err)
    })
  },

  // 删除房间
  deleteRoom(e) {
    const roomId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除房间',
      content: '确定删除这个房间吗？',
      success: (res) => {
        if (res.confirm) {
          let myRooms = wx.getStorageSync('myRooms') || []
          myRooms = myRooms.filter(r => r.roomId !== roomId)
          wx.setStorageSync('myRooms', myRooms)
          this.setData({ myRooms })

          // 同步删除云数据库
          if (wx.cloud) {
            const db = wx.cloud.database()
            db.collection('rooms').doc(roomId).remove().catch(() => {})
          }

          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 输入房间码
  onCodeInput(e) {
    this.setData({ joinCode: e.detail.value })
  },

  // 加入房间
  joinRoom() {
    const code = this.data.joinCode.trim()
    if (code.length !== 4) {
      wx.showToast({ title: '请输入4位房间码', icon: 'none' })
      return
    }
    const user = this.data.user

    if (wx.cloud) {
      const db = wx.cloud.database()
      db.collection('rooms').where({ code, status: 'waiting' }).get().then(res => {
        if (res.data.length > 0) {
          this.joinCloudRoom(res.data[0], user)
        } else {
          wx.showToast({ title: '房间不存在或已开始游戏', icon: 'none' })
        }
      }).catch(() => {
        wx.showToast({ title: '查找房间失败', icon: 'none' })
      })
    } else {
      wx.showToast({ title: '请先开通云开发', icon: 'none' })
    }
  },

  // 加入云房间
  joinCloudRoom(room, user) {
    const alreadyIn = room.players.some(p => p.id === user.id)
    if (!alreadyIn) {
      room.players.push({ ...user })
      if (room.players.length > 10) {
        wx.showToast({ title: '房间已满（最多10人）', icon: 'none' })
        return
      }
      const db = wx.cloud.database()
      db.collection('rooms').doc(room.roomId).update({
        data: { players: room.players, playerCount: room.players.length }
      })
    }
    let myRooms = wx.getStorageSync('myRooms') || []
    if (!myRooms.find(r => r.roomId === room.roomId)) {
      myRooms.unshift(room)
      wx.setStorageSync('myRooms', myRooms)
    }
    wx.setStorageSync('currentRoom', room)
    wx.navigateTo({ url: '/pages/lobby/lobby?roomId=' + room.roomId })
  },

  // 进入已有房间
  enterRoom(e) {
    const roomId = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/lobby/lobby?roomId=' + roomId })
  }
})
