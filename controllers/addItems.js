
const Item = require("../models/item");
const Sales = require("../models/sales");

module.exports=async (req, res) => {
    newitem = req.body;
    const item = new Item({
      item_name: newitem.i1,
      item_code: (await Item.countDocuments()) + 1,
      quantity: newitem.i4,
      unit_price: newitem.i3,
      description: newitem.i2,
    });
    await item.save();
    const allDetails = await Item.find({});
    res.render("inventory", { details: allDetails });
  }