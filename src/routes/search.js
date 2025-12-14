import {Router} from "express";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";
import * as help_valid from "../helpers/validation.js"

const router = new Router();

router
    .route('/search')
    .get(async (req , res)=>{
        return res.render('search',{title: "Search",user: req.session.user})
    })
    .post(async (req, res) =>{
        let search_body = req.body 
        let keyword = search_body.keyword
        let target = search_body.target
        try{
            let result =[]
            if(target === 'title'){
                result = await reports.searchByKeyword(keyword)
            }else if(target === "crime"){
                result = await reports.searchByCrime(keyword)
            }
            if(result.length !== 0){
                result = help_valid.limitDesc(result)
            }
            return res.render('search',{title:"Search",report:result,user: req.session.user})
        }catch(e){
            if(e === "404"){
                return res.status(404).render("search",{title:"Search", error: "No reports found", user: req.session.user})
            }else{
                return helpers.renderErrorPage(res, e);
            }
        }
    })

export default router;