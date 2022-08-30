const express = require('express');
const router = express.Router();


router.get('', (req, res) => {
    res.render('admin/adminLayout', { layout: false });
});



module.exports = router;