const AVATARS_MALE = ['👦','🧑','👨','🧔','💪','🤴','🦸','🧙']
const AVATARS_FEMALE = ['👧','👩','🧑‍🦰','💃','👸','🧚','💃','💋']

Page({
  data: {
    nickname: '',
    gender: 'male',
    selectedAvatar: '👦',
    avatars: AVATARS_MALE,
    roomId: null
  },

  onLoad(options) {
    // 如果从分享链接进来，带roomId
    if (options.roomId) {
      this.setData({ roomId: options.roomId })
    }
    // 检查是否已注册过
    const user = wx.getStorageSync('user')
    if (user && user.nickname) {
      if (options.roomId) {
        wx.redirectTo({ url: '/pages/lobby/lobby?roomId=' + options.roomId })
      } else {
        wx.redirectTo({ url: '/pages/index/index' })
      }
    }
  },

  pickAvatar(e) {
    this.setData({ selectedAvatar: e.currentTarget.dataset.av })
  },

  onInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  pickGender(e) {
    const g = e.currentTarget.dataset.g
    const avatars = g === 'male' ? AVATARS_MALE : AVATARS_FEMALE
    this.setData({ gender: g, avatars, selectedAvatar: avatars[0] })
  },

  doRegister() {
    const { nickname, gender, selectedAvatar, roomId } = this.data
    if (!nickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    const user = {
      id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      nickname: nickname.trim(),
      gender,
      avatar: selectedAvatar,
      createTime: Date.now()
    }
    wx.setStorageSync('user', user)

    if (roomId) {
      // 从分享链接进来，直接加入房间
      wx.redirectTo({ url: '/pages/lobby/lobby?roomId=' + roomId })
    } else {
      wx.redirectTo({ url: '/pages/index/index' })
    }
  }
})
