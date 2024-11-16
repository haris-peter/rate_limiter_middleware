const ratelimit=(limit,timewindow)=>{
    const requests={};
    return(req,res,next)=>{
        const ip=req.ip;
        const currentTime=Date.now();
        //Initialize the request object if it doesn't exist
        if(!requests[ip]){
            requests[ip]=[];
        }
        //Remove requests that are older than the time window
        requests[ip]=requests[ip].filter(request=>currentTime-request<timewindow);
        //Check if the request limit has been reached
        if(requests[ip].length>=limit){
            return res.status(429).send('Too many requests, please try again later.');
        }

        //Add the current request to the list
        requests[ip].push(currentTime);
        next();
        
    }
}
module.exports=ratelimit;