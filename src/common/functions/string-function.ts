const getAvatarText = (name :string) => {
    const members = name.split(' ');
    if(members.length > 1){
        return `${members[0][0]}${members[members.length - 1][0]}`
    }else{
        return `${members[0][0]}${members[0][1]}`
    }
}

export {
    getAvatarText
}