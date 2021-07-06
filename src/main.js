const express = require("express")
const bodyParser = require("body-parser")
const app = express()

require('./database');

app.use(bodyParser())

const User = require('./models/User');
const Tech = require("./models/Tech");

app.get('/user', async(req, res)=>{
    // const users = await User.findAll();
    
    const users = await User.findAll({
        include: { association: 'techs', attributes:['name'], through: {attributes:[]} }
    })
    return res.json(users);
})


app.post('/user', async(req, res)=>{
    try {
        const {name, email} = req.body
        
        const created = await User.create({name, email})
        res.json(created)
    }catch(e) {
        return res.status(500).json({error:e.message})
    }
})

app.get('/tech', async(req, res)=>{
    
    const techs = await Tech.findAll()
    return res.json(techs);
})


app.post('/tech', async(req, res)=>{
    try {
        const { name, user_id } = req.body

        const user = await User.findByPk(user_id);

        if (!user) {
        return res.status(400).json({ error: 'User not found' });
        }

        const [ tech ] = await Tech.findOrCreate({
            where: { name }
        });

        await user.addTech(tech);

        return res.json(tech);
    }catch(e) {
        return res.status(500).json({error:e.message})
    }
})

app.delete('/tech', async(req, res)=>{
    try {
        const { name, user_id } = req.body

        const user = await User.findByPk(user_id);

        if (!user) {
        return res.status(400).json({ error: 'User not found' });
        }

        const tech = await Tech.findOne({
            where: { name }
        });

        console.log(tech);

        await user.removeTech(tech);

        return res.json(tech);
    }catch(e) {
        return res.status(500).json({error:e.message})
    }
})


app.listen(8000,()=>console.log('app runing at port 8000'))