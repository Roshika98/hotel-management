const mongoose = require('mongoose');
const Booking = require('./booking');
const Package = require('./package');
const RoomType = require('./roomType');
const Room = require('./room');
const User = require('./user');
const Employee = require('./employee');
const Hall = require('./hall');
const HallType = require('./hallType');
const HallBooking = require('./hallBooking');
const Menu = require('./menu');
const dbUrl = 'mongodb+srv://admin101:fT6edKMdIXMlyrMV@cluster0.ah4mmoo.mongodb.net/SE_Project?retryWrites=true&w=majority';


mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('database connected');
    await addData();
});

// Room.

async function createPackages() {
    const packages = await Package.insertMany([{
        packageType: 'room only',
        description: 'includes only bed',
        itemsIncluded: [' ']
    }, {
        packageType: 'bread & breakfast',
        description: 'includes bed and breakfast only.',
        itemsIncluded: [' ']
    }, {
        packageType: 'Half Board',
        description: 'includes bed, breakfast and lunch.',
        itemsIncluded: [' ']
    }, {
        packageType: 'Full Board',
        description: ' includes bed, breakfast, lunch and dinner.',
        itemsIncluded: [' ']
    }]);
    console.log(packages);
}

async function createRoomTypes() {
    const roomTypes = await RoomType.insertMany([{
        roomType: 'deluxe double room',
        maxGuests: 2,
        standardPrice: 24,
        halfBoardPrice: 30,
        fullBoardPrice: 32,
        description: 'This double room has air conditioning and seating area.with a private balcony',
        facilities: ['Bath', 'TV', 'Iron', 'Seating Area', 'Free toiletries', 'Private bathroom', 'Electric Kettle']
    }, {
        roomType: 'superior double room',
        maxGuests: 2,
        standardPrice: 30,
        halfBoardPrice: 38,
        fullBoardPrice: 40,
        description: 'This double room features a seating area, air conditioning and superior sea view at your own private balcony',
        facilities: ['Bath', 'TV', 'Iron', 'Desk', 'Seating Area', 'Free toiletries', 'Private bathroom', 'Electric Kettle', 'Tile/marble floor']
    }, {
        roomType: 'deluxe family room',
        maxGuests: 3,
        standardPrice: 34,
        halfBoardPrice: 44,
        fullBoardPrice: 55,
        description: 'This family room has a spacious seating area, soundproofing, private balcony and an excellent view of the sea',
        facilities: ['Bath', 'TV', 'Iron', 'Desk', 'Seating Area', 'Free toiletries', 'Private bathroom', 'Electric Kettle', 'Tile/marble floor']
    }]);
    // const deluxe = await RoomType.findOne({ roomType: 'deluxe double room' });
    // const superior = await RoomType.findOne({ roomType: 'superior double room' });
    // const family = await RoomType.findOne({ roomType: 'deluxe family room' });
    // console.log(deluxe);
}

async function createRooms() {
    const deluxe = await RoomType.findOne({ roomType: 'deluxe double room' });
    const superior = await RoomType.findOne({ roomType: 'superior double room' });
    const family = await RoomType.findOne({ roomType: 'deluxe family room' });

    var count = 1;
    for (let i = 0; i < 10; i++) {
        const room = await Room.create({
            roomNo: count++,
            roomType: deluxe
        });
        console.log(room);
    }
    for (let i = 0; i < 8; i++) {
        const room = await Room.create({
            roomNo: count++,
            roomType: superior
        });
        console.log(room);
    }
    for (let i = 0; i < 3; i++) {
        const room = await Room.create({
            roomNo: count++,
            roomType: family
        });
        console.log(room);
    }
}

async function createBooking() {
    const room = await Room.findOne({ roomNo: 1 });
    const package = await Package.findOne({ packageType: 'Half Board' });
    const user = await User.findOne({ email: 'pereraroshika98@gmail.com' });
    var booking = {
        roomCount: 1,
        roomNumbers: [room.id],
        user: user.id,
        checkIn: new Date('2022-10-28'),
        checkOut: new Date('2022-10-30'),
        advance: 1000,
        total: 8000,
        adults: 3,
        children: 1,
        package: package.id
    };
    const booked = await Booking.create(booking);
    console.log(booked);
}

async function createAnEmployee(username, password) {
    const employee = new Employee({ username: username });
    const newEmployee = await Employee.register(employee, password);
    console.log(newEmployee);
}

async function createAManager(username, password) {
    const employee = new Employee({ username: username, empType: 'manager' });
    const newEmployee = await Employee.register(employee, password);
    console.log(newEmployee);
}

async function createHalls() {
    const hallType1 = await HallType.insertMany([{
        hallType: 'Master Banquet Hall',
        maxGuests: 300,
        rate: 5000,
        description: 'Both Halls are fully air- conditioned, fully carpeted and fully curtained to match cozy five star ambience. A party may obtain also two halls together for the same function, in cases of high guest capacity.'
    }, {
        hallType: 'Grown Banquet Hall',
        maxGuests: 300,
        rate: 4000,
        description: 'Both Halls are fully air- conditioned, fully carpeted and fully curtained to match cozy five star ambience. A party may obtain also two halls together for the same function, in cases of high guest capacity.'
    }]);
    for (let i = 0; i < hallType1.length; i++) {
        const element = hallType1[i];
        const hall = await Hall.create({
            hallNo: i + 1,
            hallType: element
        });
        console.log(hall);
    }
}


async function addData() {
    // await createPackages();
    // await createRoomTypes();
    // await createRooms();
    // await Booking.createCollection();
    // await createBooking();
    // await createAnEmployee('EMP001', 'Hello');
    await createAManager('EMP002', 'manager');
    // await createHalls();
    // await HallBooking.createCollection();
}