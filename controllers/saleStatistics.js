
const Item = require("../models/item");
const Sales = require("../models/sales");
module.exports=async (req, res) => {
    var filter = 0;
    try {
      const allsalesforpie = await Sales.aggregate([
        {
          $match: {},
        },
        {
          $group: {
            _id: "$item_name",
            total: {
              $sum: { $multiply: ["$quantity", "$unit_price"] },
            },
          },
        },
        {
          $addFields: {
            item_name: "$_id",
          },
        },
      ]);
      const allsales = await Sales.find({});
      const allDetails = await Item.find({});
     
      res.render("sales_stat", { allsales, allDetails, allsalesforpie, filter });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }