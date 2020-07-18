const router = require('express').Router()
const fileupload  = require('express-fileupload')
const path = require('path')
const fs = require('fs-extra')
const Image = require('../models/image')
const User  = require('../models/user')
const rand = require('../utils/libs')
const auth = require('../utils/auth')

router.use(fileupload({
    fileSize: 50*1024*1024
}))

router.post('/updateavatar', auth, async (req, res) => {
    const save = async () => {
        const ran = rand()
        const imgs = await Image.find({ filename: { $regex: ran } })
        if (imgs.length > 0) save()
        else {
            //console.log(ran)
            const imagee = req.files.img
            //imagee.tempFilePath = path
            //console.log(imagee)
            const ext = path.extname(imagee.name)
            const targetPath = path.join(__dirname, `../public/upload/${ran}${ext}`)
            console.log(targetPath)
            if (ext == '.png' || ext == '.jpg' || ext == '.jpeg') {
                await imagee.mv(targetPath)
                const img = new Image({
                    path: targetPath,
                    relativepath: path.join(`/v1.0/api/img/getavatar/?id=${ran}`),
                    idUser: req.userId,
                    filename: ran + ext
                })
                await Image.findOneAndUpdate({idUser: req.userId, active: 1}, {active: 0})
                await img.save()
                console.log(img)
                await User.findByIdAndUpdate(req.userId, {avatar: img.id})
                res.status(200).json({ msg: 'avatar actualizado', img })
                //note: 'mi primera idea para hacer la prueba con
                //la ruta get(/v1.0/api/img/getavatar/?id=) 
                //fue usar el atributo filename sin la extension'
            }
            else return res.status(500).json({ error: 'el formato de la imagen no es valida'})
        }
    }
    save()
})

router.get('/getavatar', auth, async (req,res)=>{
    var params = req.query
    if(!params)return res.send('es necesario un id')
    var {id} = params
    var gimg = await Image.findById(id)
    if(gimg) return res.sendFile(gimg.path)
    res.send('error en la peticion')
})
//para no pasar ningun id y que el usuario pueda acceder a su avatar actual
router.get('/getactualavatar', auth, async (req,res)=>{
    const ava = await Image.findOne({idUser: req.userId, active: 1})
    if(ava) return res.sendFile(ava.path)
    res.send('error al encontrar el avatar actual')
})

module.exports = router