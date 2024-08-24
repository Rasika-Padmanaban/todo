let myPromises=new Promise((myResolve,myReject)=>{
    setTimeout(()=>{
        myReject('adhirai');
    },2000)
})
myPromises.then(()=>{
    console.log('sucess');
}).catch(()=>{
    console.log('failed');
})