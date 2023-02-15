const embeddedCrud = async () => {
    try{
        // create a new user
        const newUser = await db.User.findOneAndUpdate(
            { name: "Eric4"},
            { email: 'e@n ', password: 'en'  },
            { new: true, upsert: true }
        )
        // creates a new item
        const newItem = await db.Item.findOneAndUpdate(
            {name: 'Paper'} ,
            { price: 5 , category: 'fake wares' , url: 'n/a' } ,
            //upsert is an update or create command
            {upsert: true, new: true}
        )

        // associates user with item
        // newUser.items.push(newItem._id)
        // await newUser.save()

        // // associates item with a user
        // newItem.userId = newUser._id
        // await newItem.save()

        // console.log('new user', newUser)
        // console.log('new item:', newItem)

        // find user that is associated with items
        const user = await db.User.findOne({
            name: 'Eric4'
        }).populate('items')

        console.log('this is user', user)

        // find items associated with user
        // const foundItem = await db.Item.findOne({
        //     name: "Silver Ware"
        // }).populate("userId")
        // console.log('found item', foundItem)


        // example of how to update
        // const updatedItem = await db.Item.findOne(
        //     {name: "Silver Ware"}
        // )
        // updatedItem.price = 10000
        // await updatedItem.save()
        // console.log('new pricing', updatedItem)

        

        // const gotDelete = await db.Item.findOne({
        //     name: "Paper plate"
        // })

        // gotDelete.remove()
        // await gotDelete.save()

        // console.log('got deleted', gotDelete)

      
    
    } catch(err){
        console.log(err)
    }
}

embeddedCrud()