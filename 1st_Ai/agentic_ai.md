Can any text to text model tell me -->
Q. what is teh current weather of Assam?-->No
as it will no be able to tell me real time data or else even of it could say so it will be outdated data or untill an unless we have provided him any context --> it can only tell me teh reelvant data on which it is been trained upon

<!-- LLM  -->is just a brain -->  it need hands and lesg to do something as we have LLM as braib but we need body to do any task we here we have agent --->[LLM with hands and legs is called agent]

<!-- how to run linix command to make file folder etc using node - - import {exec} from child_process --!> -->

async fucntion execcummand(cmd){
    return new Promise((res,res)=>{
        exec(cmd,(err,data)=>{
            if(err){
                return res(err);
            }
            else{
                return res(data);
            }
        })
    })
}

// we can also use this -->

async function execcummand(cmd){
    const {stdout,stderr}=await exec(cmd);
    if(stderr){
        return stderr;
    }
    return stdout;
}