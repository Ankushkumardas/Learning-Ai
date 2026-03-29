mainly used for voice agents -->
{ needsApproval: true,
}

in voice agnest we will have -->under sesssin object

agent.onToolApprovaRequired=(tool,appprove)=>{
//this is a callback function
//tool is the tool that is called
//appprove is the function that is called to approve the tool
alert(agent want to run `tool`)
if(yes) approve
}
