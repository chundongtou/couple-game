const {GAMES,getRandomItem} = require('../../utils/games')

const SUITS=['♠','♥','♦','♣']
const VALUES=['A','2','3','4','5','6','7','8','9','10','J','Q','K']

Page({
  data:{
    roomId:'',room:null,players:[],activePlayers:[],user:null,
    currentGame:'',gameName:'',soloMode:false,showGameList:false,gameList:[],gameColor:'#ff6b9d',
    wheelAngle:0,wheelSpinning:false,wheelItems:[],
    truthResult:'',truthTarget:null,
    dareResult:'',darePerformer:null,
    diceAnim:false,diceResult:'',diceAction:'',dicePart:'',diceTime:'',dicePunishment:'',diceTarget:null,dicePunishTarget:null,
    kingCards:[],kingCommand:'',kingPlayer:null,
    tissueSize:100,tissueDone:false,tissuePunishment:'',tissuePlayers:[],
    guessCorrect:0,guessResult:'',guessDone:false,guessTarget:null,bodyParts:['✋ 手背','💪 手臂','🦵 大腿','🫁 肚子','💋 脖子','👂 耳朵','🫦 嘴唇','👠 脚'],
    guessWordIndex:0,guessWordScore:0,guessWordCurrent:'',guessWordTimeLeft:60,guessWordTimer:null,guessWordDone:false,guessWordList:[],guessWordPunishText:'',
    rpsPlayer:'',rpsComputer:'',rpsResult:'',rpsPunishment:'',rpsMyName:'',rpsOppName:'',rpsPunishTarget:'',
    hbStage:0,hbTimer:null,hbTimeLeft:0,hbQuestion:'',hbStarted:false,hbFinished:false,hbStageDesc:'',
    rwWheelAngle:0,rwSpinning:false,rwResult:null,rwWheelItems:[],rwTarget:null,
    whisperShow:false,whisperContent:'',whisperDone:false,
    watchStop:null
  },

  onLoad(options){
    const user = wx.getStorageSync('user')
    if(!user||!user.nickname){
      wx.redirectTo({url:'/pages/register/register'})
      return
    }
    const roomId = options.roomId || ''
    const gameId = options.gameId || options.id || ''
    const mode = options.mode || 'normal'

    if(mode==='solo' && !gameId){
      const soloPlayers = wx.getStorageSync('soloPlayers') || []
      if(soloPlayers.length===0){
        const fake1 = {id:'solo_1',nickname:'玩家1',gender:'male',avatar:'😎',selected:true}
        const fake2 = {id:'solo_2',nickname:'玩家2',gender:'female',avatar:'🥰',selected:true}
        const list = GAMES.map(g=>({id:g.id,name:g.name,icon:g.icon,desc:g.desc}))
        this.setData({soloMode:true,showGameList:true,gameList:list,players:[fake1,fake2],activePlayers:[fake1,fake2]})
      } else {
        const players = soloPlayers.map(p=>({...p,selected:true}))
        const list = GAMES.map(g=>({id:g.id,name:g.name,icon:g.icon,desc:g.desc}))
        this.setData({soloMode:true,showGameList:true,gameList:list,players,activePlayers:players})
      }
      wx.setNavigationBarTitle({title:'选择游戏'})
      return
    }

    this.setData({user,roomId,currentGame:gameId,showGameList:false})
    const game = GAMES.find(g=>g.id===gameId)
    if(game){
      this.setData({gameName:game.name,gameColor:game.color})
      wx.setNavigationBarTitle({title:game.name})
    }
    if(!this.data.soloMode) this.loadRoomPlayers(roomId,user)
    if(roomId && wx.cloud) this.startSync(roomId)
    this.initGame(gameId)
  },

  onUnload(){
    if(this.data.watchStop) this.data.watchStop()
    if(this.data.guessWordTimer) clearInterval(this.data.guessWordTimer)
    if(this.data.hbTimer) clearInterval(this.data.hbTimer)
  },

  selectSoloGame(e){
    const gameId = e.currentTarget.dataset.id
    const game = GAMES.find(g=>g.id===gameId)
    if(!game) return
    this.setData({showGameList:false,currentGame:gameId,gameName:game.name,gameColor:game.color})
    wx.setNavigationBarTitle({title:game.name})
    this.initGame(gameId)
  },

  backToGameList(){
    if(this.data.guessWordTimer) clearInterval(this.data.guessWordTimer)
    if(this.data.hbTimer) clearInterval(this.data.hbTimer)
    const list = GAMES.map(g=>({id:g.id,name:g.name,icon:g.icon,desc:g.desc}))
    this.setData({showGameList:true,currentGame:'',gameList:list,guessWordTimer:null,hbTimer:null})
    wx.setNavigationBarTitle({title:'选择游戏'})
  },

  loadRoomPlayers(roomId,user){
    if(!roomId){
      const saved = wx.getStorageSync('players') || []
      const players = saved.map(p=>({...p,selected:true}))
      this.setData({players,activePlayers:players})
      return
    }
    let myRooms = wx.getStorageSync('myRooms') || []
    let room = myRooms.find(r=>r.roomId===roomId)
    if(room && room.players){
      const players = room.players.map(p=>({...p,selected:true}))
      this.setData({room,players,activePlayers:players})
    }
  },

  startSync(roomId){
    if(!wx.cloud) return
    const db = wx.cloud.database()
    const watcher = db.collection('rooms').doc(roomId).watch({
      onChange:(snapshot)=>{
        if(!snapshot.docs || !snapshot.docs[0]) return
        const doc = snapshot.docs[0]
        if(doc.players){
          const players = doc.players.map(p=>({...p,selected:true}))
          this.setData({players,activePlayers:players})
        }
        if(doc.gameState && doc.gameState.actor !== this.data.user.id){
          this.applyGameState(doc.gameState)
        }
      },
      onError:(err)=>{ console.log('同步出错:',err) }
    })
    this.setData({watchStop:()=>watcher.close()})
  },

  applyGameState(state){
    if(state.type==='spin_truth'){
      this.setData({wheelSpinning:false,truthResult:state.content,truthTarget:state.target})
    }else if(state.type==='spin_dare'){
      this.setData({wheelSpinning:false,dareResult:state.content,darePerformer:state.target})
    }else if(state.type==='roll_dice'){
      this.setData({diceAnim:false,diceResult:state.value,diceTarget:state.target,dicePunishment:state.content})
    }
  },

  syncState(state){
    if(!this.data.roomId || !wx.cloud) return
    const db = wx.cloud.database()
    db.collection('rooms').doc(this.data.roomId).update({
      data:{gameState:{...state,actor:this.data.user.id,time:Date.now()}}
    })
  },

  getRandomPlayer(){
    const active = this.data.activePlayers.length>0 ? this.data.activePlayers : this.data.players
    if(active.length===0) return null
    return active[Math.floor(Math.random()*active.length)]
  },

  getRandomPair(){
    const active = this.data.activePlayers.length>0 ? this.data.activePlayers : this.data.players
    if(active.length<2) return [active[0]||null, active[0]||null]
    const shuffled = this.shuffle([...active])
    return [shuffled[0],shuffled[1]]
  },

  shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]
    }
    return arr
  },

  initGame(id){
    switch(id){
      case 'truth': this.initTruthWheel(); break
      case 'dare': this.initDareWheel(); break
      case 'dice': this.setData({diceAnim:false,diceResult:'',diceAction:'',dicePart:'',diceTime:'',dicePunishment:'',diceTarget:null,dicePunishTarget:null}); break
      case 'king': this.initKing(); break
      case 'tissue': this.initTissue(); break
      case 'blindfold': this.initGuess(); break
      case 'guess': this.initGuessWord(); break
      case 'rps': this.initRPS(); break
      case 'heartbeat': this.initHB(); break
      case 'punish': this.initPunishWheel(); break
      case 'whisper': break
    }
  },

  fillWheelItems(gameId){
    const g = GAMES.find(g=>g.id===gameId)
    if(!g||!g.items) return []
    const shuffled = this.shuffle([...g.items])
    return shuffled.slice(0,8)
  },

  // ===== 真心话转盘 =====
  initTruthWheel(){
    const items = this.fillWheelItems('truth')
    this.setData({wheelItems:items,wheelAngle:1080,wheelSpinning:false,truthResult:'',truthTarget:null})
  },

  spinTruthWheel(){
    if(this.data.wheelSpinning) return
    this.setData({wheelSpinning:true,truthResult:'',truthTarget:null})
    const items = this.fillWheelItems('truth')
    const targetSeg = Math.floor(Math.random()*8)
    const spins = 360*5
    const extraAngle = targetSeg*45+22.5
    const totalAngle = this.data.wheelAngle+spins+extraAngle
    this.setData({wheelItems:items,wheelAngle:totalAngle})
    setTimeout(()=>{
      const target = this.getRandomPlayer()
      this.setData({wheelSpinning:false,truthResult:items[targetSeg],truthTarget:target})
      this.syncState({type:'spin_truth',content:items[targetSeg],target:target})
    },4600)
  },

  // ===== 大冒险转盘 =====
  initDareWheel(){
    const items = this.fillWheelItems('dare')
    this.setData({wheelItems:items,wheelAngle:1080,wheelSpinning:false,dareResult:'',darePerformer:null})
  },

  spinDareWheel(){
    if(this.data.wheelSpinning) return
    this.setData({wheelSpinning:true,dareResult:'',darePerformer:null})
    const items = this.fillWheelItems('dare')
    const targetSeg = Math.floor(Math.random()*8)
    const spins = 360*5
    const extraAngle = targetSeg*45+22.5
    const totalAngle = this.data.wheelAngle+spins+extraAngle
    this.setData({wheelItems:items,wheelAngle:totalAngle})
    setTimeout(()=>{
      const target = this.getRandomPlayer()
      this.setData({wheelSpinning:false,dareResult:items[targetSeg],darePerformer:target})
      this.syncState({type:'spin_dare',content:items[targetSeg],target:target})
    },4600)
  },

  // ===== 骰子大冒险 =====
  rollDice(){
    if(this.data.diceAnim) return
    this.setData({diceAnim:true,diceResult:'',diceAction:'',dicePart:'',diceTime:'',dicePunishment:'',dicePunishTarget:null})
    setTimeout(()=>{
      const g = GAMES.find(g=>g.id==='dice')
      const num = Math.floor(Math.random()*6)+1
      const isPunish = Math.random()<0.3
      if(isPunish && g.punishments){
        const p = g.punishments[Math.floor(Math.random()*g.punishments.length)]
        const target = this.getRandomPlayer()
        this.setData({diceAnim:false,diceResult:num,dicePunishment:p,dicePunishTarget:target,diceTarget:target})
        this.syncState({type:'roll_dice',value:num,content:p,target:target})
      }else{
        const parts=['嘴唇','脖子','耳垂','锁骨','手背','大腿','腰','耳朵']
        const actions=['亲','舔','咬','吸','摸','吻']
        const times=['10秒','15秒','20秒','30秒','1分钟']
        const part=parts[Math.floor(Math.random()*parts.length)]
        const action=actions[Math.floor(Math.random()*actions.length)]
        const time=times[Math.floor(Math.random()*times.length)]
        const target = this.getRandomPlayer()
        this.setData({diceAnim:false,diceResult:num,diceAction:action,dicePart:part,diceTime:time,diceTarget:target})
        this.syncState({type:'roll_dice',value:num,content:action+' '+part+' '+time,target:target})
      }
    },800)
  },

  // ===== 国王游戏 =====
  initKing(){
    const cards = VALUES.slice(0,10).concat(['J','Q','K']).map((v,i)=>({
      suit:SUITS[i%4],value:v,display:v+SUITS[i%4],revealed:false,isKing:v==='K'
    }))
    this.setData({kingCards:cards,kingCommand:'',kingPlayer:null})
  },

  revealKing(e){
    const idx = e.currentTarget.dataset.idx
    const cards = [...this.data.kingCards]
    if(cards[idx].revealed) return
    cards[idx].revealed = true
    this.setData({kingCards:cards})
    if(cards[idx].isKing){
      const target = this.getRandomPlayer()
      const g = GAMES.find(g=>g.id==='king')
      const cmd = g.items[Math.floor(Math.random()*g.items.length)]
      this.setData({kingCommand:cmd,kingPlayer:target})
      this.syncState({type:'king_command',content:cmd,target:target})
    }else{
      const revealed = cards.filter(c=>c.revealed).length
      if(revealed>=cards.length-1){
        const lastIdx = cards.findIndex(c=>!c.revealed)
        cards[lastIdx].revealed = true
        this.setData({kingCards:cards})
        wx.showToast({title:'没有人抽到国王！',icon:'none'})
      }
    }
  },

  // ===== 传纸巾 =====
  initTissue(){
    const pair = this.getRandomPair()
    this.setData({tissueSize:100,tissueDone:false,tissuePunishment:'',tissuePlayers:pair})
  },

  passTissue(){
    if(this.data.tissueDone) return
    const newSize = Math.max(0, this.data.tissueSize - Math.floor(Math.random()*20+10))
    if(newSize<=0){
      const g = GAMES.find(g=>g.id==='tissue')
      const p = g.punishments[Math.floor(Math.random()*g.punishments.length)]
      this.setData({tissueSize:0,tissueDone:true,tissuePunishment:p})
    }else{
      this.setData({tissueSize:newSize})
    }
  },

  tissueDropBtn(){
    if(this.data.tissueDone) return
    const g = GAMES.find(g=>g.id==='tissue')
    const p = g.punishments[Math.floor(Math.random()*g.punishments.length)]
    this.setData({tissueSize:0,tissueDone:true,tissuePunishment:p})
  },

  // ===== 蒙眼寻宝 =====
  initGuess(){
    const target = this.getRandomPlayer()
    this.setData({guessCorrect:0,guessResult:'',guessDone:false,guessTarget:target})
  },

  guessPart(e){
    if(this.data.guessDone) return
    const part = e.currentTarget.dataset.part
    const isCorrect = Math.random()<0.5
    if(isCorrect){
      const newCount = this.data.guessCorrect+1
      if(newCount>=3){
        this.setData({guessCorrect:newCount,guessDone:true,guessResult:''})
      }else{
        this.setData({guessCorrect:newCount,guessResult:'猜对了！是'+part})
      }
    }else{
      this.setData({guessResult:'猜错了，再来！'})
    }
  },

  nextGuess(){ this.setData({guessResult:''}) },

  // ===== 你比我猜 =====
  initGuessWord(){
    const g = GAMES.find(g=>g.id==='guess')
    const shuffled = this.shuffle([...g.items])
    this.setData({
      guessWordIndex:0,guessWordScore:0,guessWordCurrent:shuffled[0]||'',
      guessWordTimeLeft:60,guessWordDone:false,guessWordList:shuffled,
      guessWordPunishText:'',guessWordTimer:null
    })
  },

  startGuessWord(){
    if(this.data.guessWordTimer) return
    this.setData({guessWordTimeLeft:60,guessWordScore:0,guessWordIndex:0,guessWordDone:false,guessWordPunishText:''})
    const list = this.data.guessWordList
    this.setData({guessWordCurrent:list[0]||''})
    const timer = setInterval(()=>{
      const left = this.data.guessWordTimeLeft-1
      if(left<=0){
        clearInterval(this.data.guessWordTimer)
        const score = this.data.guessWordScore
        let punish = ''
        if(score<3) punish='太少了！接受惩罚！'
        else if(score<6) punish='还行吧~'
        else punish='太厉害了！不用受罚！'
        this.setData({guessWordTimeLeft:0,guessWordDone:true,guessWordTimer:null,guessWordPunishText:punish})
      }else{
        this.setData({guessWordTimeLeft:left})
      }
    },1000)
    this.setData({guessWordTimer:timer})
  },

  guessWordCorrect(){
    const newScore = this.data.guessWordScore+1
    const newIdx = this.data.guessWordIndex+1
    const list = this.data.guessWordList
    this.setData({
      guessWordScore:newScore,guessWordIndex:newIdx,
      guessWordCurrent:list[newIdx]||'词库用完了'
    })
  },

  guessWordSkip(){
    const newIdx = this.data.guessWordIndex+1
    const list = this.data.guessWordList
    this.setData({guessWordIndex:newIdx,guessWordCurrent:list[newIdx]||'词库用完了'})
  },

  // ===== 石头剪刀布 =====
  initRPS(){
    const pair = this.getRandomPair()
    this.setData({
      rpsPlayer:'',rpsComputer:'',rpsResult:'',rpsPunishment:'',
      rpsMyName:pair[0]?pair[0].nickname:'你',
      rpsOppName:pair[1]?pair[1].nickname:'对手',
      rpsPunishTarget:''
    })
  },

  playRPS(e){
    if(this.data.rpsResult) return
    const move = e.currentTarget.dataset.move
    const moves=['rock','scissors','paper']
    const computer = moves[Math.floor(Math.random()*3)]
    const emoji={rock:'✊',scissors:'✌️',paper:'🖐️'}
    let result='',punish=''

    if(move===computer){ result='平局！再来！' }
    else if((move==='rock'&&computer==='scissors')||(move==='scissors'&&computer==='paper')||(move==='paper'&&computer==='rock')){
      result='你赢了！'
      const g = GAMES.find(g=>g.id==='rps')
      const p = g.punishments[Math.floor(Math.random()*g.punishments.length)]
      punish = this.data.rpsOppName+' '+p
    }else{
      result='你输了！'
      const g = GAMES.find(g=>g.id==='rps')
      const p = g.punishments[Math.floor(Math.random()*g.punishments.length)]
      punish = this.data.rpsMyName+' '+p
    }
    this.setData({rpsPlayer:move,rpsComputer:computer,rpsResult:result,rpsPunishment:punish})
  },

  // ===== 心跳告白 =====
  initHB(){
    const descs=['十指相扣，感受彼此的温度，坚持30秒','从背后抱住对方，在耳边说悄悄话，坚持30秒','额头相贴，闭眼感受彼此的呼吸，坚持30秒']
    const questions=['最想和对方做的事？','第一次心动的瞬间？','最想听对方说的一句话？','如果只能带一个人旅行，带谁？','最珍惜对方的一个习惯？']
    this.setData({
      hbStage:0,hbTimeLeft:0,hbQuestion:questions[Math.floor(Math.random()*questions.length)],
      hbStarted:false,hbFinished:false,hbStageDesc:descs[0]
    })
  },

  startHB(){
    const descs=['十指相扣，感受彼此的温度，坚持30秒','从背后抱住对方，在耳边说悄悄话，坚持30秒','额头相贴，闭眼感受彼此的呼吸，坚持30秒']
    const questions=['最想和对方做的事？','第一次心动的瞬间？','最想听对方说的一句话？','如果只能带一个人旅行，带谁？','最珍惜对方的一个习惯？']
    let timeLeft = 30
    this.setData({hbStarted:true,hbTimeLeft:timeLeft})
    if(this.data.hbTimer) clearInterval(this.data.hbTimer)
    const timer = setInterval(()=>{
      timeLeft--
      if(timeLeft<=0){
        clearInterval(timer)
        const nextStage = this.data.hbStage+1
        if(nextStage>=3){
          this.setData({hbFinished:true,hbStarted:false,hbTimer:null,hbStage:nextStage})
        }else{
          this.setData({hbStage:nextStage,hbStarted:false,hbTimer:null,hbTimeLeft:0,hbStageDesc:descs[nextStage],hbQuestion:questions[Math.floor(Math.random()*questions.length)]})
        }
      }else{
        this.setData({hbTimeLeft:timeLeft})
      }
    },1000)
    this.setData({hbTimer:timer})
  },

  // ===== 惩罚大转盘（20格） =====
  initPunishWheel(){
    const g = GAMES.find(g=>g.id==='punish')
    const colors=['#ff6b6b','#ee5a24','#f0932b','#6ab04c','#22a6b3','#4834d4','#be2edd','#eb4d4b','#f9ca24','#7ed6df','#e056fd','#686de0','#badc58','#f8a5c2','#63cdda','#cf6a87','#574b90','#3dc1d3','#e15f41','#786fa6']
    const items = []
    const shuffled = this.shuffle([...g.items])
    for(let i=0;i<20;i++){
      items.push({text:shuffled[i%shuffled.length],color:colors[i%colors.length]})
    }
    this.setData({rwWheelItems:items,rwWheelAngle:1080,rwSpinning:false,rwResult:null,rwTarget:null})
  },

  spinPunishWheel(){
    if(this.data.rwSpinning) return
    this.setData({rwSpinning:true,rwResult:null,rwTarget:null})
    const targetSeg = Math.floor(Math.random()*20)
    const spins = 360*6
    const extraAngle = targetSeg*18+9
    const totalAngle = this.data.rwWheelAngle+spins+extraAngle
    this.setData({rwWheelAngle:totalAngle})
    setTimeout(()=>{
      const target = this.getRandomPlayer()
      const item = this.data.rwWheelItems[targetSeg]
      this.setData({rwSpinning:false,rwResult:item,rwTarget:target})
      this.syncState({type:'punish_wheel',content:item.text,target:target})
    },5000)
  },

  // ===== 悄悄话传声筒 =====
  nextWhisper(){
    const g = GAMES.find(g=>g.id==='whisper')
    const item = g.items[Math.floor(Math.random()*g.items.length)]
    this.setData({whisperShow:true,whisperContent:item,whisperDone:false})
  },

  hideWhisper(){
    this.setData({whisperShow:false,whisperDone:true})
    this.syncState({type:'whisper',content:this.data.whisperContent})
  },

  resetWhisper(){
    this.setData({whisperShow:false,whisperDone:false,whisperContent:''})
  },

  goBack(){ wx.navigateBack() }
})