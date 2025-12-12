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
        let target = search_body.target
        try{
            let result =[]
            if(target === 'title'){
                result = await reports.searchByKeyword(keyword)
            }else if(target === "crime"){
                result = await reports.searchByCrime(keyword)
            }else if(target ==='zipcode'){
                result = await reports.searchByZipCode(keyword)
            }
            return res.render('search',{title:"Search",report:result})
        }catch(e){
            if(e === "404"){
                return res.status(404).render("search",{title:"Search", error:"Not found"})
            }else{
                return helpers.renderErrorPage(res, e);
            }
        }
    })
router
    .route('/search/:zip')
    .get(async(req,res)=>{
        const zip = req.params.zip
        try{
            result = await reports.searchByZipCode(zip)
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