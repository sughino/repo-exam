import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user.userId,
            email: user.email,
            admin: user.admin 
        }, 
        process.env.JWT_SECRET || '447db8cacc89c778fff6894f88febce8f20dba808622fe7b934cdea88eacf16cd22cc7d28492dfb7fc44387ab5fcc49fb7dd5bc12335f7c767cc59fa8eec9a15316cd062c60fca77395e68c28177325745a381ef532a9b21b8fca0a835686c422fa82630d312068b27850ef9e16ec749595eec0aafa8fcbcaebe1f16a6f889a65ddf6cb09e110fc86874575c732b01cdf2bd71139373e55ef392d3aff9fa112b3513c2f098827b51b62bc905e756131c3c93fd44c6b1be03f21b9a8a3655554e767f2c211862d4b09e5df5c97bf3b28ef21ba086f77224f7b1893580b83b7577a1d75f93b1f51b557dc2ceda5061d56f4ce78c231d6f543368d41ac37339035c', 
        { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );
};

export const generateRefreshToken = (user, longToken) => {
    return jwt.sign(
        { 
            userId: user.userId,
            email: user.email,
            admin: user.admin 
        }, 
        process.env.JWT_SECRET_REFRESH || '5383b02c49fdf94cd1a9ef36155f4d07355be72a124bc15989c1746c1a51f189e7385e8ab223d13876333ec1dceaf2178e563f4e13b93f521a82c476bf80452ebc8e90a4cae48aca80529e6327cdbda11dd10931d0f4e201e58c7ed88d74d074e4c058e8fda70f7ae36676010f5a1bf4e8fa3fc594922254034db9f6f117dcd26f4dbc80c6d4f0eb644e73314af4bf65fc148338a9fc14a00e4377ddb2a1217af1d330f4242d840b5f64587353273362afb51be82f88fcb41868c8facf39d2e758abab1263dc3d271b22a762bb51fd7407c9d95ded30b9c2ee1a3f3de0987e7e4f3e080fc1c5ba046ef18031e94a14bd2eb0d40bb43b2641256d665581c07ded', 
        { expiresIn: longToken ? process.env.JWT_LONG_REFRESH_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN || '1d' }
    );
};