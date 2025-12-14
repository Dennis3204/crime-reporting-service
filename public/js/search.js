const search_form = document.getElementById('search_form')
if(search_form){
    let keyword_element = document.getElementById("keyword")
    let target_element = document.getElementById('target')
    let error_div = document.getElementById('error_block')
    let error_p = document.getElementById('error')
    search_form.addEventListener('submit',(event)=>{
        keyword = keyword_element.value
        target = target_element.value
        try{
            error_div.hidden = true
            if(keyword.trim().length === 0)
                throw "Please enter a keyword"
            if(target !== "title" && target !== "crime")
                throw "Ivalid Category"
        }catch(e){
            event.preventDefault()
            const message = typeof e === 'string' ? e : e.message;
            error_p.textContent = message
            error_div.hidden = false
        }
    })
}