var express = require('express')
var router = express.Router()
const Contact = require('../models/contact')
const withAuth = require('../middlewares/auth')

//Create Contact
router.post('', withAuth, async (req, res) => {
    const {name, tel, email} = req.body
    try {
        if(await exist(name,req.user)){
           res.status(406).json({error: "Already existing contact name"})
        }else{
        const contact = new Contact({name,tel,email,owner: req.user._id})
        await contact.save()
        res.status(200).json(contact)
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Problem to create a new contact"})
    }
})

router.get('/', withAuth, async(req ,res) => {
    try {
        const contact = await Contact.find({"owner":req.user._id})
        if(!contact){
            res.status(403).json({error: "Permission Denied"})
        }   else{
            res.status(200).json(contact)
        }    
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Problem to find a contact"})
    }
})
// find contact by name 
router.get('/:name', withAuth, async(req ,res) => {
    const {name} = req.params
    try {
        const contact = await Contact.findOne({name: name,owner: req.user._id})
        if(!contact){
            res.status(406).json({error: "Contact not found"})
        }else{
            if(isOwner(contact, req.user)){
                res.status(200).json(contact)
            }else{
                res.status(403).json({error: "Permission Denied"})
            }    
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Problem to find a contact"})
    }
})
// find contact by ID
router.get('/:id', withAuth, async(req ,res) => {
    const {id} = req.params
    try {
        const contact = await Contact.findById(id)  
        if(!isOwner(contact, req.user)){
            res.status(403).json({error: "Permission Denied"})
        }   else{
            console.log(contact)
            res.status(200).json(contact)
        }    
    } catch (error) {
        res.status(500).json({error: "Problem to find a contact"})
    }
})

router.put('/:id', withAuth, async(req, res) => {
    const {id} = req.params
    const {name,tel,email} = req.body
    try {
        const contact = await Contact.findById(id)
        if(!contact){
            res.status(406).json({error: "Contact not found"})
        }else{
            if(!isOwner(contact,req.user)){
                res.status(403).json({error: "Permission Denied"})
            }else {
                const newContact = await Contact.findByIdAndUpdate(id,{name:name, tel:tel, email:email},{new:true}) 
                //await contact.updateOne({name:name, tel:tel, email:email})
                //const newContact = await Contact.findById(id)
                res.status(200).json(newContact)
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Problem to update a contact"})
    }
})

router.delete('/:id', withAuth,async(req,res)=> {
    const {id} = req.params
    try {
        const contact = await Contact.findById(id)
        if(!contact){
            res.status(406).json({error: "Contact not found"})
        }else{
            if(!isOwner(contact,req.user)){
                res.status(403).json({error: "Permission Denied"})
            }else{
                contact.deleteOne()
                res.json({"Contact Deleted": contact})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Problem to delete a contact"})
    }
})

async function exist (name, user){
    const contact = await Contact.findOne({name: name,owner: user._id})
    if((contact)? (true) : (false)){
        console.log(true)
        return true
    }else{
        console.log(false)
        return false
    }
}


function isOwner (contact, user) {
    const contactOwnerID =  JSON.stringify(contact.owner)
    const userID = JSON.stringify(user._id)
    if(contactOwnerID === userID){
        return true
    }else {
        return false
    }
}

module.exports = router