import { useContext, useEffect, useState } from "react";
import { Button } from "../buttons";
import { Loader } from "../loader";
import { ThemeContext } from "styled-components";
import "./dialog.css";
import { Separator } from "../Separator";
import Text from "../Text";

export const Dialog = ({isOpen, isLoading, _id, name, surname, onCancel, onDelete, isError}) => {
    const theme = useContext(ThemeContext);
    const [localError, setLocalError] = useState(false);
    
    useEffect(() => {
        setLocalError(true);
    }, [isError])
    useEffect(() => {
        if(!isOpen) {
            setLocalError(false);
        }
    }, [isOpen])
    return (
        <div className="main-dialog-container" key={_id}>
            <div className="dialog-text-container">
                {localError && isError?.response?.data?.message ? <Text variant={'h6'}>{isError.response.data.message}</Text> : null}
                <Text variant={'h4'} color={theme.colors.warning}>Confirmation Deletion</Text>
                <Text variant={'body'}>Are you sure you want to delete {name} {surname}? This action is irreversible.</Text>
            </div>

            <Separator color={theme.colors.white10}/>

            <div className="dialog-buttons-container">
                <Button variant={'accent'} size={'regular'} type={"cancel"} onClick={() => {onCancel();}}>Cancel</Button>
                <Loader isLoading={isLoading} color={theme.colors.white} bgColor={theme.colors.warning}>
                    <Button variant={'warning'} size={'regular'} onClick={() => onDelete(_id)}>Delete</Button>
                </Loader>
            </div>
        </div>
    )
}