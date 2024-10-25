  export const getSender = (loggedUser, users) => {
       return users[0]?._id === loggedUser?.id ? users[1].name : users[0].name;
  };
  export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser.id ? users[1] : users[0];
  };
  export const isSameSender=(messages, m, i, userid)=>{
            //console.log(userid);
            //console.log(m.sender._id);
            if(m.sender?._id===userid) return true;
            else return false;
  }
  export const isLastMessage=(messages,m,i,userid)=>{
         const lastindex=messages.length-1;
         if(lastindex===i){
                return true;
         }
         if(m.sender._id!=messages[i+1].sender._id) return true;
         else return false; 
}
export const isNextsameuser=(messages,m,i,userid)=>{
       let lastindex=messages.length-1;
       if(lastindex===i) return false;
}
  