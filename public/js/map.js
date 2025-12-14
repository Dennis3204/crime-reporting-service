
const svg = document.getElementById("combined")
const div = document.getElementById("onHover")
const div_p = document.getElementById("OnHover-Zip")
const res = document.getElementById('result')

svg.addEventListener('mousemove',function(event){
    const path = event.target.closest('path')
    const className = path.getAttribute("id")
    div_p.textContent = className
})

svg.addEventListener('mouseleave',function(){
    div_p.textContent = "-----"
})
