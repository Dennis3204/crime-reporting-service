import {Router} from "express";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";
import * as help_valid from "../helpers/validation.js"

const router =  new Router();

router
    .route("/")
    .get(async(req,res) =>{
        res.render('map',{title:"Map",user: req.session.user})
    })
router
    .route('/:zip')
    .get(async(req,res)=>{
        const zip = req.params.zip
        try{
            let result = await reports.searchByZipCode(zip)
            if(result.length !== 0){
                result = help_valid.limitDesc(result)
            }
            return res.render('map',{title:"Map",report:result,zipcode:zip,user: req.session.user})
        }catch(e){
            if(e === "404"){
                return res.status(404).render("map",{title:"Map", error:"No reports found", zipcode: zip, user: req.session.user})
            }else{
                return helpers.renderErrorPage(res, e);
            }
        }
    })

export default router