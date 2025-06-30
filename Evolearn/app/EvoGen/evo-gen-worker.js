let moduleLoad = {}
onmessage = (data) =>{
    data = data.data
    console.log(data[0],data[1])
    import(`./utilities/${data[1]}`).then((module)=>{
       moduleLoad = module
    })

    if(data[1] === 'evolution.js'){
        console.log(moduleLoad.generateInitialPopulation(data[2],data[3]))
        postMessage([moduleLoad.generateInitialPopulation(data[2],data[3])])
    }
}