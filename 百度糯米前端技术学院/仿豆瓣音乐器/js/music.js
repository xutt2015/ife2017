// var music=document.getElementById('music'); 
// music.volume=0.5; 设置声音0-1
// music.currentTime=40; 设置开始播放位置40表示0:40
// music.loop=true; 单曲循环模式
// music.duration; 音频的长度
// music.currentTime; 音频的现在播放的长度
// music.play();//开始播放
// music.pause();//暂停播放
$=function (id) {
	return document.getElementById(id);
}
var Music=(function(){
	var audio=document.getElementsByTagName('audio')[0];//radio标签
	var musicList=$('musicList');//歌曲列表
	var musicName=$('name');//歌名
	var singer=$('singer');//歌手
	var playedTime=$('playedTime');//播放时间与总时间
	var volumn=$('volumn');//声音按钮
	var volumnPro=$('volumnPro');//声音选择器
  var _process=$('process');//进度条
  var heart=$('heart');//喜爱按钮
  var del=$('del');//删除按钮
  var playModel=$('model');//播放模式
  var download=$('download');//删除按钮
  var pre=$('pre');//上一首按钮
  var play=$('play');//播放按钮
  var next=$('next');//下一首
  var pic=$('pic');//图片信息
  var currentIndex;//当前正在播放那一首
  var musicListArr;//歌曲清单
  var firstEnter;//记录是否是第一次进去网页
  var model;//记录歌曲播放模式，目前只有两种可扩展
  var volumnSize;//为了将声音返回到上一状态

  function init(_musicList){
   currentIndex=0;
   musicListArr=_musicList;
   firstEnter=true;
   model='order';
   volumnSize=50;
   initmusicList(musicListArr);
   initMusicDetail(0);
 }

	//初始化声音调节器显示隐藏
	volumn.onmouseover=function(){
		$('volumnPro').style.display='flex';
	}
	volumn.onmouseout=function(){
		$('volumnPro').style.display='none';
	}
	//调节我喜爱的选中取消
	heart.onclick=function(){
		if (this.style.color!='red') {
			this.style.color='red';	
		}
		else{
			this.style.color='black';
		}
	}
	//初始化musicList
	function initmusicList(_musicList){
		var html='<ol>';
    for (var i = 0; i < musicListArr.length; i++) {
     html+='<li title="'+musicListArr[i].name+' - '+musicListArr[i].singer+'" index="'+i+'">'+musicListArr[i].name+' - '+musicListArr[i].singer+'</li>'; 
   }
   html+='</ol>';
   musicList.innerHTML=html;
 }
	//添加歌曲选中事件
	musicList.onclick=function(event){
		var target=event.target;
		if (target&&target.tagName.toLowerCase()=='li') {
      var index=target.attributes['index'].value;
      firstEnter=false;
      initMusicDetail(index);
    }
  }
  //初始化歌曲详情
  function initMusicDetail(index){
    var obj=musicListArr[index];
    musicName.innerText=obj.name;
    singer.innerText=obj.singer;
    audio.src=obj.src;
    download.href=obj.src;
    download.download=obj.src.replace('audios/','');
    var li=musicList.getElementsByTagName('li');
    li[currentIndex].className='';
    li[index].className='selected';
    currentIndex=index;
    if (!firstEnter) {
      //动画重置
      pic.style.animation='';
      //开始播放
      audio.play();
      play.getElementsByTagName('i')[0].className='fa fa-pause fa-lg';
    }
  }
  audio.onloadeddata=function(){
    playedTime.innerText='0:00/'+getTimeInfo(audio.duration);
  }
  //开始播放与暂停
  play.onclick=function(){
    var i=this.getElementsByTagName('i')[0];
    if (audio.paused) {
      i.className='fa fa-pause fa-lg';
      audio.play();
    }
    else{
      i.className='fa fa-play fa-lg';
      audio.pause();
      pic.style.animationPlayState='paused';
    }
  }
  //将秒转化为分秒格式
  function getTimeInfo(duration){
    var second=parseInt(duration%60)>9?parseInt(duration%60):'0'+parseInt(duration%60);
    return parseInt(duration/60)+':'+second;
  }
  audio.onplay=function(){
    if (pic.style.animation==='') {
      pic.style.animation='ratate 10s linear infinite';
    }
    else{
      if (pic.style.animationPlayState==='paused') {
        pic.style.animationPlayState='initial';
      }
    }
    var timer=setInterval(function(){
      if (!audio.ended) {
        updateTimeInfo();
        updateProgress();
      }
      else{
        clearInterval(timer);
        pic.style.animation='';
        if (model=='order') {
          updateMusic('next');
        }
      }
    },1000);
  }
  //播放进度信息控制
  function updateTimeInfo(){
   playedTime.innerText=getTimeInfo(audio.currentTime+1)+'/'+getTimeInfo(audio.duration);
 }
   //更新进度条
   function updateProgress(){
    var width=parseInt((audio.currentTime/audio.duration)*600);
    process.getElementsByClassName('processLen')[0].style.width=width+'px';
  }
  //进度条选择
  process.onclick=function(event){
    var left=event.layerX;
    process.getElementsByClassName('processLen')[0].style.width=left+'px';
    audio.currentTime=(left/600)*(audio.duration);
    updateProgress()
    event.preventDefault();
  }
  //控制声音
  function updateVolumen(height){
    var i=volumn.getElementsByTagName('i')[0];
    if (height===0) {
      i.className="fa fa-volume-off";
    }
    else{
      volumnSize=height;
      i.className="fa fa-volume-up";
    }
    volumnPro.getElementsByClassName('processLen')[0].style.height=height+'px';
    volumnPro.getElementsByClassName('ball')[0].style.bottom=(height-5)+'px';
    audio.volume=height/50;
  }
  //声音选择
  volumnPro.onclick=function(event){
    if (event.layerY>=47) {
      updateVolumen(0);
    }
    else{
      updateVolumen(50-event.layerY);
    }
    event.preventDefault();
  }
  //控制是否静音
  volumn.getElementsByTagName('i')[0].onclick=function(){
    var i=this;
    if (i.className.indexOf('fa-volume-up')==-1) {
      i.className="fa fa-volume-up";
      updateVolumen(volumnSize);
    }
    else{
      updateVolumen(0);
    }
  }
  //上一首
  pre.onclick=function(){
    updateMusic('pre');
  }
  //下一首
  next.onclick=function(){
    updateMusic('next');
  }
  //更新歌曲
  function updateMusic(director){
    var index;
    if (director==='pre') {
      index=currentIndex==0?(musicListArr.length-1):(currentIndex-1);
    }
    else{
      index=currentIndex==(musicListArr.length-1)?0:(currentIndex+1);
    }
    firstEnter=false;
    initMusicDetail(index);
  }
  //播放模式，暂时只有两种。可扩展
  playModel.onclick=function(){
    var i=this.getElementsByTagName('i')[0];
    switch(model){
     case 'order':
     i.className='fa fa-refresh fa-lg';
     model='cycle';
     audio.loop=true;
     break;
     case 'cycle':
     i.className='fa fa-reorder fa-lg';
     model='order';
     audio.loop=false;
     break;
   }
 }
 //删除歌曲
 del.onclick=function(){
  // var ol= musicList.getElementsByTagName('ol')[0];
  // ol.removeChild(ol.childNodes[index]);
  if (musicListArr.length!=1) {
    musicListArr.splice(currentIndex,1);
    initmusicList(musicListArr);
    currentIndex=currentIndex===0?0:currentIndex-1;
    firstEnter=false;
    initMusicDetail(currentIndex);
  }
  else{
    alert('只剩一首歌，不能删除！');
  }
}

return {init:init};
});