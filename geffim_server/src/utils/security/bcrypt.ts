import bycript from 'bcryptjs';

export const encode = async (word : string)=>{
    const salt = await bycript.genSalt(12);
    const hash = await bycript.hash(word, salt);
    return hash;
}

export const compare = async(word:string, hashed:string)=>{
    return await bycript.compare(word,hashed)
}