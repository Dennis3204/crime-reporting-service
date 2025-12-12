import {Router} from "express";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";

const router =  new Router();

router
    .route("/")
    .get(async(req,res) =>{
        res.render('map',{title:"Map"})
    })
router
    .route('/:zip')
    .get(async(req,res)=>{
        const zip = req.params.zip
        try{
            let result = await reports.searchByZipCode(zip)
            return res.render('map',{title:"Map",report:result,zipcode:zip})
        }catch(e){
            if(e === "404"){
                return res.status(404).render("map",{title:"Map", error:"Not found",zipcode:zip})
            }else{
                return helpers.renderErrorPage(res, e);
            }
        }
    })

export default router