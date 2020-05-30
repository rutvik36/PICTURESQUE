
var j;
function changee()
{ setTimeout(function(){x=document.querySelector(".active img");
var a=x.getAttribute("src");
y="url("+a+")";
//console.log(y);
var z=document.querySelectorAll(".imgdiv");
for(var i=0;i<z.length;i++)
{ z[i].style.backgroundImage=y;}},603.5);





//document.querySelector("#a"+(j+1)).style.backgroundImage=y;
//document.querySelector(").style.backgroundImage=y;
} /*<input type="file" id="real-file" hidden="hidden"/>
<button type="button" id="custom-button">CHOOSE A FILE</button>
<span id="custom-text">No file chosen, yet.</span>*/
const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

/*customBtn.addEventListener("click", function() {
  realFileBtn.click();
});*/

realFileBtn.addEventListener("change", function() {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
    j=customTxt.innerHTML;
    //console.log(j);
  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
  });

  function img_val()
  {
    var selectedFile = document.getElementById("real-file");
var idxDot = j.lastIndexOf(".") + 1;

var extFile = j.substr(idxDot, j.length).toLowerCase();
//alert(j.value);
if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "svg" || extFile == "gif") {
   //do whatever want to do

   return true;
} else {
     alert("Only jpg/jpeg, png, gif and svg files are allowed!");
     return false;
}
}
