
const svg = document.getElementById("combined")
const div = document.getElementById("onHover")
const res = document.getElementById('result')

svg.addEventListener('mousemove',function(event){
    const path = event.target.closest('path')
    const className = path.getAttribute("id")
    div.textContent = className
    div.style.display="block"
})

svg.addEventListener('mouseleave',function(){
    div.style.display ='none'
})
