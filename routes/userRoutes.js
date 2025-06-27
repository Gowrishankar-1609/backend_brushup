const express = require('express');
const router = express.Router();  
const User=require('../models/user')



router.post('/',async (req,res)=>{
    try{
        const user=await User.create(req.body);
    res.status(201).json(user);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }


});
 
router.get('/',async (req,res)=>{
    const users=await User.find();
    res.json(users);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Send back updated user
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;