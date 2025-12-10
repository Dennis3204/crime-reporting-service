import {Router} from "express";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";

const router = new Router();

router
    .route('/search')
    .get(async (req , res)=>{
        return res.render('search',{title: "Search"})
    })
    .post(async (req, res) =>{
        let search_body = req.body 
        let keyword = search_body.keyword
        try{
            let result = await reports.searchByKeyword(keyword)
            return res.render('search',{title:"Search",report:result})
        }catch(e){
            if(e === "404"){
                return res.status(404).render("search",{title:"Search", error:"Not found"})
            }else{
                return helpers.renderErrorPage(res, e);
            }
        }
    })

export default router;