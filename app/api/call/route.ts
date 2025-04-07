import { NextResponse } from 'next/server';
import axios from 'axios';
 
export async function POST(
  req: Request,
){
    try{
        const input = await req.json();
        console.log("[CALL]", input);
        const response = await axios.post('https://8ukuwum7b1.execute-api.eu-west-2.amazonaws.com/dev/call', input);

        console.log("[CALL]",response);
        return NextResponse.json("Success", {status: 200});

    }catch(error){
        console.log("[CALL]",error);
        return new NextResponse(error + "Internal Error", {status: 500});
    }

}