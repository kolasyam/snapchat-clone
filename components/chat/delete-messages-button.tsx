"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Loader2 } from "lucide-react";
import { deleteChatAction } from "@/lib/actions";
import { useParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
const DeleteMessagesButton = () => {
	const {id:userId}=useParams<{id:string}>();
	const deleteChatActionWithId=deleteChatAction.bind(null,userId as string)
	const [errorMessage,dispatch]=useFormState(deleteChatActionWithId,null)
	return (
		<form action={dispatch}className='flex flex-col'>
			<DeleteButton />
			{errorMessage?<p className='text-red-500'>{errorMessage}</p>:null}
		</form>
	);
};
export default DeleteMessagesButton;

function DeleteButton() {
	const {pending} = useFormStatus();
	return (
		<Button className='bg-sigButtonSecondary  hover:bg-sigButtonSecondaryHover w-12 h-12 rounded-full '>
			{!pending ? <Trash /> : <Loader2 className='h-4 w-4 animate-spin' />}
		</Button>
	);
}