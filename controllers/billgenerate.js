
const Bill = require("../models/bill");

const Item = require("../models/item");
const Sales = require("../models/sales");
module.exports=async (req, res) => {
    if (res.locals.currentUser.user_type != "Clerk") {
      req.flash("error", "Only Sales Clerk is authorized for this action");
      res.redirect("/welcome");
    }

    var bill = req.body;
   
    const date = new Date();
    bill.date = date;
  
    var bill_items = [];
  
    for (let i = 0; i < bill.code.length; i++) {
      var q = await Item.find({ item_code: bill.code[i] });
      const x = await Item.findOneAndUpdate(
        { item_code: bill.code[i] },
        { quantity: q[0].quantity - bill.qty[i] }
      );
      bill_items.push({
        item_code: bill.code[i],
        name: q[0].item_name,
        quantity: bill.qty[i],
        unit_price: bill.price[i],
      });
      const sell = new Sales({
        item_code: bill.code[i],
        item_name: q[0].item_name,
        unit_price: bill.price[i],
        quantity: bill.qty[i],
        date: date,
      });
      await sell.save();
   
    }
    
  
    const new_bill = new Bill({
     
      items: bill_items,
      total_cost: bill.sub_total,
      date: bill.date,
    });
    await new_bill.save();
  
    bill.id = await Bill.countDocuments();
    bill.bill_items = bill_items;

  
    res.render("print_bill", { bill });
  
  }