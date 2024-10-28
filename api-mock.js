import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = {
    // 获取司机列表
    getDrivers: async () => {
        try {
            const driversJSON = await AsyncStorage.getItem('drivers');
            let drivers = [];

            if (driversJSON !== null) {
                drivers = JSON.parse(driversJSON);
            }

            return { data: drivers };
        } catch (error) {
            console.error('Error fetching drivers:', error);
            throw error;
        }
    },

    // 创建用户
    createUser: async ({ name, email, clerkId }) => {
        try {
            if (!name || !email || !clerkId) {
                throw new Error('Missing required fields');
            }

            const usersJSON = await AsyncStorage.getItem('users');
            let users = [];

            if (usersJSON !== null) {
                users = JSON.parse(usersJSON);
            }

            const newUser = {
                id: Date.now(), // 简单的ID生成方式
                name,
                email,
                clerkId,
            };

            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));

            return { data: newUser };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    // 创建乘车记录
    createRide: async (rideData) => {
        try {
            const {
                origin_address,
                destination_address,
                origin_latitude,
                origin_longitude,
                destination_latitude,
                destination_longitude,
                ride_time,
                fare_price,
                payment_status,
                driver_id,
                user_id,
            } = rideData;

            if (
                !origin_address ||
                !destination_address ||
                !origin_latitude ||
                !origin_longitude ||
                !destination_latitude ||
                !destination_longitude ||
                !ride_time ||
                !fare_price ||
                !payment_status ||
                !driver_id ||
                !user_id
            ) {
                throw new Error('Missing required fields');
            }

            const ridesJSON = await AsyncStorage.getItem('rides');
            let rides = [];

            if (ridesJSON !== null) {
                rides = JSON.parse(ridesJSON);
            }

            const newRide = {
                ride_id: Date.now(), // 简单的ID生成方式
                ...rideData,
                created_at: new Date().toISOString(),
            };

            rides.push(newRide);
            await AsyncStorage.setItem('rides', JSON.stringify(rides));

            return { data: newRide };
        } catch (error) {
            console.error('Error inserting data into rides:', error);
            throw error;
        }
    },

    // 获取用户的乘车记录
    getUserRides: async (userId) => {
        if (!userId) throw new Error('Missing required fields');

        try {
            const ridesJSON = await AsyncStorage.getItem('rides');
            const driversJSON = await AsyncStorage.getItem('drivers');

            let rides = [];
            let drivers = [];

            if (ridesJSON !== null) {
                rides = JSON.parse(ridesJSON);
            }

            if (driversJSON !== null) {
                drivers = JSON.parse(driversJSON);
            }

            // 过滤出指定用户的乘车记录
            const userRides = rides.filter((ride) => ride.user_id === userId);

            // 为每个乘车记录添加司机信息
            const ridesWithDriver = userRides.map((ride) => {
                const driver = drivers.find((d) => d.id === ride.driver_id) || {};
                return {
                    ...ride,
                    driver: {
                        driver_id: driver.id,
                        first_name: driver.first_name,
                        last_name: driver.last_name,
                        profile_image_url: driver.profile_image_url,
                        car_image_url: driver.car_image_url,
                        car_seats: driver.car_seats,
                        rating: driver.rating,
                    },
                };
            });

            // 按照创建时间降序排序
            ridesWithDriver.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            return { data: ridesWithDriver };
        } catch (error) {
            console.error('Error fetching recent rides:', error);
            throw error;
        }
    },
};
