
const Item = require("../models/item");
const Sales = require("../models/sales");

module.exports=async (req, res) => {

    newitem = req.body;
    const x = await Item.findOneAndUpdate(
      { item_code: parseInt(newitem.i1) },
      { unit_price: newitem.i3, quantity: newitem.i4 }
    );
    const allDetails = await Item.find({});
    res.render("inventory", { details: allDetails });
  }