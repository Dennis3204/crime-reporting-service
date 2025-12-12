import {Router} from "express";

const router =  new Router();

router
    .route("/")
    .get(async(req,res) =>{
        res.render('map',{title:"Map"})
    })

export default router