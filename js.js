// JavaScript Document
//根据ID获取对象
function $(id){
	return document.getElementById(id);
}
var users=null;//全局用户对象数组
var selecttarget=null,selectcloum=null;
var student_num=0,page_now=0;
//函数1：检测提交数据是否正确
function formtest(){
	//var tt=(student_num%15==0)?parseInt(student_num/15):Math.ceil(student_num/15);
//	1.取整
//// 丢弃小数部分,保留整数部分
//parseInt(5/2)　　// 2
//// 向上取整,有小数就整数部分加1
//Math.ceil(5/2)　　// 3
//// 向下取整,丢弃小数部分
//Math.floor(5/2)　　// 2
//// 四舍五入
//Math.round(5/2)　　// 3
//// 取余
//6%4　　// 2
//	alert("stu::"+student_num+"::tt:"+tt);
//	alert(student_num/15);
	var username=$("username").value;
	var userid=$("userid").value;
	
	var javascore=$("javascore").value;
	var sqlscore=$("sqlscore").value;
	var springscore=$("springscore").value;
	if(username==""){
		alert("用户名不能为空!");
		return false;
	}
	if(userid==""){
		alert("ID不能为空!");
		return false;
	}
	
	var userclass=getinsertclassnumber();
	
	if(userclass==""){
		alert("班级不能为空!");
		return false;
	}
	reqdatashow(userid,username,userclass,javascore,sqlscore,springscore);
	insertuser(userid,username,userclass,javascore,sqlscore,springscore);
}
	/**
	 * reqdatashow
	 * @param {type} userid,username,userclass,userscore 
	 */
//显示上次添加的用户信息
function reqdatashow(userid,username,userclass,javascore,sqlscore,springscore) {
	 var showdata="上次输入数据:<br>userid:"+userid+"<br>username:"+username+"<br>userclass:"+userclass+"<br>javascore:"+javascore+"<br>sqlscore:"+sqlscore+"<br>springscore:"+springscore;
	 $("submittext").innerHTML=showdata;
	 	
}
//用于在提交数据过程中获取被选中班级
function getinsertclassnumber(){
	var userclasses=document.getElementsByName("userclass");
	var userclass="";
	for(var i=0;i<userclasses.length;i++){
		if(userclasses[i].checked){
			userclass=userclasses[i].value;
		}
	}
	return userclass;
}
//获取ajax对象，用于ajax获取数据
function getxmlhttp(){
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();//非IE浏览器
	}else if(window.ActiveXObject){
		try{
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");//ie浏览器适配
	 	} catch (otherMS) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");//ie浏览器适配
			} catch (failed) {
				xmlhttp = null;
			}
		}
	}
	return xmlhttp;
}
//ajax向服务器发出添加用户请求
function insertuser(userid,username,userclass,javascore,sqlscore,springscore){
	var xmlhttp=getxmlhttp();
	if(xmlhttp==null){
		alert("浏览器该换了。。。");
	}else{
		xmlhttp.onreadystatechange=function(){ insertusergo(xmlhttp)};					
		xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("reqtype=insertStudent&userid="+userid+"&username="+username+"&userclass="+userclass+"&javascore="+javascore+"&sqlscore="+sqlscore+"&springscore="+springscore);
	}		
}
//处理ajax添加用户的返回数据，函数
function insertusergo(xmlhttp){
	if(xmlhttp.status==200 && xmlhttp.readyState==4){
		var taga=xmlhttp.responseText;
		//alert(typeof taga);
		//alert(typeof "true");
		if(taga.trim()=="true".trim()){//trim()为了防止比较不成功
			$("message").innerHTML="<font color=\"green\">添加用户成功</font>";
			//alert("true aaa");
		}else{
			//alert("false aaa");
			$("message").innerHTML="<font color=\"red\">添加用户失败</font>";
		}
	}
}
//跳转页面
function jump_page(){
	var jump_page_num=$("jump_page_num").value;
	var pagenum=(student_num%15==0)?parseInt(student_num/15):Math.ceil(student_num/15);
	console.log("jump_page::"+jump_page_num);
	if(jump_page_num<=0||jump_page_num>pagenum){
	   	$("page_info").innerHTML="不存在页面";
		return false;
	}else{
		getpage((jump_page_num-1)*15,jump_page_num*15);
	}
}

//发出ajax请求，分页全部用户
function selectAlluserpage(num){
	
		var startpage=0;//分页开始处
		if(page_now==0||student_num==0||num==0){
		   	startpage=0;//从0开始
		}else if(num==1){//下一页
			startpage=page_now*15;
		}else if(num==-1){//上一页
			startpage=(page_now*15)-30;
		}else{
			 startpage=0;//从0开始
		}
		
		if(startpage<0){//第一页，不再分页
			$("page_info").innerHTML="没有上一页";
			return false;
		}else if(student_num!=0&&startpage>=student_num){//最后一页，不再分页
			$("page_info").innerHTML="已经是最后一页";
			return false;
		}else{
			getpage(startpage,num);
		}		
}

function getpage(startpage,num){
	var xmlhttp=getxmlhttp();
	if(xmlhttp==null){
		$("mesgdiv").innerHTML("浏览器该换了。。。");
	}else{
		console.log("page_now::"+page_now+":student_num::"+student_num);
		$("page_info").innerHTML="";
		xmlhttp.onreadystatechange=function(){ selectAlluserpagego(xmlhttp,num)};				
		xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("reqtype=selectStudentPage&startpage="+startpage+"&studentnum=15");//method
	}
}
function selectAlluserpagego(xmlhttp,num){
	if(xmlhttp.status==200 && xmlhttp.readyState==4){
		if(num==0){
		   	page_now=1;
		}else if(num==-1){
			page_now=page_now-1;
		}else if(num==1){
			page_now=page_now+1;	 
		}else{
			page_now=num/15;
		}
		var text=xmlhttp.responseText;
		var usertext=eval("(" + text + ")");
		//$("showdata").innerHTML=text;
		users=usertext.scores;//新建用户对象数组
		student_num=usertext.studentnum;//总人数
		//console.log("page_num::"+page_num);
		$("page_num").innerHTML=(student_num%15==0)?parseInt(student_num/15):Math.ceil(student_num/15);
		$("page").style.display="inline";//显示分页详细信息
		$("page_now").innerHTML=page_now;
		$("avgscore").innerHTML=usertext.avgscore;
		
		showtable();
	}
}
//发出ajax请求，获取数据库中的全部用户
function selectAlluser(){
	var xmlhttp=getxmlhttp();
	if(xmlhttp==null){
		$("mesgdiv").innerHTML("浏览器该换了。。。");
	}else{
		xmlhttp.onreadystatechange=function(){ selectAllusergo(xmlhttp)};					
		xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("reqtype=selectAllStudent");
	}		
}
function selectAlluserBy(){
	var reqtype=$("selectAllbytarget").value;//排序目标
	var cloum=$("selectAllbycloum").value;
	if(users==null||selecttarget==null||selectcloum==null||selecttarget!=reqtype||selectcloum!=cloum){
	   var xmlhttp=getxmlhttp();
		if(xmlhttp==null){
			$("mesgdiv").innerHTML("浏览器该换了。。。");
		}else{
			
			selecttarget=reqtype;selectcloum=cloum;
			xmlhttp.onreadystatechange=function(){ selectAllusergo(xmlhttp)};					
			xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("reqtype="+reqtype+"&cloum="+cloum);
		}
	}
//	else{
//		alert("无排序条件");
//	}
}
//模糊查询用户，以用户名
function selectAllLikeName(){
	var xmlhttp=getxmlhttp();
	if(xmlhttp==null){
		$("mesgdiv").innerHTML("浏览器该换了。。。");
	}else{
		var username=$("searchusername").value;
		xmlhttp.onreadystatechange=function(){ selectAllusergo(xmlhttp)};					
		xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("reqtype=selectAllLikeName&username="+username);
	}		
}

//用于处理从服务器获取的全部用户数据
function selectAllusergo(xmlhttp){
	if(xmlhttp.status==200 && xmlhttp.readyState==4){
		var text=xmlhttp.responseText;
		var usertext=eval("(" + text + ")");
		//$("showdata").innerHTML=text;
		users=usertext.scores;//新建用户对象数组
		student_num=usertext.studentnum;//总人数
		var page_num=(student_num%15==0)?parseInt(student_num/15):Math.ceil(student_num/15);
		page_now=0;//清空当前页数
		$("page").style.display="none";
		console.log("page_num::"+page_num);
		$("page_num").innerHTML=page_num;
		$("page_now").innerHTML=page_now;
		$("maxscore").innerHTML=usertext.maxscore;
		$("minscore").innerHTML=usertext.minscore;
		$("avgscore").innerHTML=usertext.avgscore;
		showtable();
	}
}
//向页面中注入获取的全部用户数据，以表格的形式显示
function showtable(){
	//alert(users[1].username+"::"+users.length);
	var tabletext="<table border=\"1\" id=\"showtable\"><tr><th>编号</th><th>学号</th><th>姓名</th><th>班级</th><th>java</th><th>sql</th><th>spring</th><th>总分</th><th>操作</th></tr>";
	var i,classnumber=new Array(users.length);
	for(i=0;i<=users.length;i++){
		if(i==users.length){
			tabletext+="</table>";
			break;
		}else{
//			if(users[i].userscore>maxscore){
//	//			alert("max");
//				maxscore=users[i].userscore;
//			}
//			if(users[i].userscore<minscore){
//				minscore=users[i].userscore;
//			}
			console.log("已出现班级："+users[i].userclass);
			classnumber[i]=users[i].userclass;
				
			tabletext+="<tr><td>"+(i+1)+"</td><td>"+users[i].userid+"</td><td>"+users[i].username+"</td><td>"+users[i].userclass+"</td><td>"+users[i].javascore+"</td><td>"+users[i].sqlscore+"</td><td>"+users[i].springscore+"</td><td>"+users[i].userscore+"</td><td><input style=\"color:white;border-radius: 10px;border:0;background-color:red;\" type=\"button\" id=\"\" value=\"删除\" onClick='deleteuser(\""+users[i].userid+"\")'/>&nbsp<a href='javascript:updateuserinfobut(\""+users[i].userid+"\")'><input type=\"button\" style=\"color:white;border-radius: 10px;border:0;background-color:green;\" id=\"\" value=\"修改\" onClick=\"\"/></a></td></tr>";
			continue;
		}
	}
	
	$("allclasspnum").innerHTML=student_num;
	$("showdata").innerHTML=tabletext;
	//清空筛选记录
	$("oneclassnum").innerHTML="";
	$("oneclasspnum").innerHTML="";
	$("maxclassscore").innerHTML="";
	$("minclassscore").innerHTML="";
	//绑定css类
	$("showtable").className="tableclass";
	//console.log($("showdata").innerHTML);
	getclassnumber(classnumber);
}
//用于处理从服务器获取的全部用户数据中有多少不同的班级出现，并显示在页面的选择框中
function getclassnumber(classnumber){//获取出现的班级
	var arr=new Array(classnumber.length);
	var indexnum=0;
	console.log("length::"+classnumber.length);
	for(var i=0;i<classnumber.length;i++){//扫描不同的数字
		
		var istrue=true;//重复标志位
		if(i==0){
		   arr[i]=classnumber[i];//初始化数组
			indexnum++;
			continue;
		}
//		console.log("iii::"+i);
		for(var j=0;j<i;j++){
//			console.log("进入添加不同数值");
			if(arr[j]==classnumber[i]){
				console.log("出现相同数值");
				istrue=false;
			    break;
			}
		}
		if(istrue){
			console.log("出现不同数值："+classnumber[i]);
			arr[indexnum++]=classnumber[i];//存入不同数值
		}
	}
	var selecttext="<option value=\"0\">不选择</option>";
	
	for(var i=0;i<indexnum;i++){
		console.log("测试输出：：："+arr[i]+":index:"+indexnum+" 长度测试：："+arr.length);
		selecttext+="<option value=\""+arr[i]+"\">"+arr[i]+"班</option>";
	}
	$("selectuserclass").innerHTML=selecttext;//向页面写入数据
	//alert("test");
}

//delete删除用户数据
function deleteuser(userid){
	if(confirm("确定删除用户"+userid+"吗？"))
	{
		var xmlhttp=getxmlhttp();
		if(xmlhttp==null){
			alert("浏览器该换了。。。");
		}else{
			//处理更新用户数据返回结果
			xmlhttp.onreadystatechange=function(){
				if(xmlhttp.status==200 && xmlhttp.readyState==4){
					var taga=xmlhttp.responseText;
					if(taga.trim()!="true".trim()){//trim()为了防止比较不成功
						//更新成功
						$("message").innerHTML="<font color=\"red\">用户未被删除</font>";
					}else{
						$("message").innerHTML="<font color=\"green\">用户删除成功</font>";
					}
				}
			};					
			xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("reqtype=deleteStudentByID&userid="+userid);
		}
	}
}

//update更新用户数据
function updateuserinfo(){
	var xmlhttp=getxmlhttp();
	if(xmlhttp==null){
		alert("浏览器该换了。。。");
	}else{
		var username=$("updateusername").value;
		var userid=$("updateuserid").innerHTML;
		var userclass=$("updateuserclass").value;
		
		var javascore=$("updatejavascore").value;
		var sqlscore=$("updatesqlscore").value;
		var springscore=$("updatespringscore").value;
		//alert("username::"+username);
		//处理更新用户数据返回结果
		var showdata="上次更新数据:<br>userid:"+userid+"<br>username:"+username+"<br>userclass:"+userclass+"<br>javascore:"+javascore+"<br>sqlscore:"+sqlscore+"<br>springscore:"+springscore;
		xmlhttp.onreadystatechange=function(){updateuserinfogo(xmlhttp,showdata)};					
		xmlhttp.open("POST","http://localhost:8080/mybatis-web/Servlet",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("reqtype=updateUser&userid="+userid+"&username="+username+"&userclass="+userclass+"&javascore="+javascore+"&sqlscore="+sqlscore+"&springscore="+springscore);
	}
	
}
function updateuserinfogo(xmlhttp,showdata){
	
	if(xmlhttp.status==200 && xmlhttp.readyState==4){
			var taga=xmlhttp.responseText;
			if(taga.trim()=="true".trim()){//trim()为了防止比较不成功
				//更新成功
				$("submittext").innerHTML=showdata;
				$("message").innerHTML="<font color=\"green\">更新用户信息成功</font>";
			}else{
				$("message").innerHTML="<font color=\"red\">更新用户信息失败</font>";
			}
	}
}

//打开更新输入框
function updateuserinfobut(userid){
	$("updateuserid").innerHTML=userid;
	$("updateinfowindow").style.display="inline";
}
//关闭更新输入框
function closeupdatewindow(){
	//清空输入框
	$("updateinfowindow").style.display="none";
}


//处理筛选操作，构建筛选文本数据
function dofilter(){
	var userclass=$("selectuserclass").value;
	//var userid=$("fuserid").value;
	//var username=$("fusername").value;
	var userscore=$("fuserscore").value;
	//console.log(userid=="");
	var filtertext="";
	if(userclass=="0"&&userscore==""){
		console.log(users!=null+"::test::"+userclass=="0");
		if(users!=null){
		   showtable();
		}
		//不进行筛选
	}else if(userclass!="0"){
		if(userscore!=""){
			//alert("不是0");
			filtertext="users[i].userclass=="+userclass+"&&users[i].userscore=="+userscore;
			filtertabledata(filtertext);
			//按照班级和成绩筛选信息
		}else {
			filtertext="users[i].userclass=="+userclass;
			filtertabledata(filtertext);
			//按照班级筛选信息
		}
		
	}else if(userscore!=""){
		alert("userscore");
		filtertext="users[i].userscore=="+userscore;
		filtertabledata(filtertext);
		//按照成绩筛选信息
	}
}
//根据构建的筛选文本数据，进行筛选操作
function filtertabledata(filtertext){//筛选数据
	
	var tabletext="<table border=\"1\" id=\"showtable\"><tr><th>编号</th><th>学号</th><th>姓名</th><th>班级</th><th>java</th><th>sql</th><th>spring</th><th>总分</th><th>操作</th></tr>";
	var maxscore=0,minscore=10000,i,j=1,userclass="无班级";
	//var ttt=userclass+"==33",ttt2="users[i].userclass";
	console.log("过滤条件："+filtertext);
	for(i=0;i<=users.length;i++){
		if(i==users.length){//最后的后一条记录
			tabletext+="</table>";
			break;
		}else{
			//条件筛选处
			if(eval(filtertext)){//查找条件
				
				userclass=users[i].userclass;
				//console.log("userscore::"+users[i].userscore);
				if(users[i].userscore>maxscore){
					maxscore=users[i].userscore;
				}
				if(users[i].userscore<minscore){
					minscore=users[i].userscore;
					
				}
				tabletext+="<tr><td>"+(j++)+"</td><td>"+users[i].userid+"</td><td>"+users[i].username+"</td><td>"+users[i].userclass+"</td><td>"+users[i].javascore+"</td><td>"+users[i].sqlscore+"</td><td>"+users[i].springscore+"</td><td>"+users[i].userscore+"</td><td><input style=\"color:white;border-radius: 10px;border:0;background-color:red;\" type=\"button\" id=\"\" value=\"删除\" onClick='deleteuser(\""+users[i].userid+"\")'/>&nbsp<a href='javascript:updateuserinfobut(\""+users[i].userid+"\")'><input type=\"button\" style=\"color:white;border-radius: 10px;border:0;background-color:green;\" id=\"\" value=\"修改\" onClick=\"\"/></a></td></tr>";
				
				continue;
			}else{
				continue;
			}
		}
	}
	$("showdata").innerHTML=tabletext;
	$("oneclassnum").innerHTML=userclass;
	$("oneclasspnum").innerHTML=j-1;
	$("maxclassscore").innerHTML=maxscore;
	$("minclassscore").innerHTML=minscore;
	$("showtable").className="tableclass";
}
//全局临时测试方法，用于书写测试方法
function testone(){
	alert("this is test!");
}

