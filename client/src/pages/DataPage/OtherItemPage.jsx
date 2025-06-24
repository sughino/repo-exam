import { TableTemplate } from "../../components/TableTemplate";
import { Card } from "../../components/SpotlightCard";
import { Skeleton } from '@mui/material';
import { ThemeContext } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Filters } from "../../components/Filters";
import { Spacer } from "../../components/Spacer";
import Text from "../../components/Text";
import { Modal } from "../../components/modal";
import { UserForm } from "../../components/DataForms";
import { Button } from "../../components/buttons";
import { Separator } from "../../components/Separator";
import { useLocation } from "react-router-dom";
import userService from "../../services/userServices";
import { Dialog } from "../../components/dialog";
import socket from "../../utils/socket";
import { useRoutes } from "../../context/RoutesContext" 
import './DataPage.css';

export const OtherItemPage = () => {
    let location = useLocation().pathname.substring(1);
    const routes = useRoutes();
    const theme = useContext(ThemeContext);
    const userLength = localStorage.getItem('userLength');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isTable, setIsTable] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] =  useState(false);
    const [filters, setFilters] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const searchForPlaceholder = "Search by name and surname"
    const filtersSelect = ['User id', 'Name & Surname', 'Email', 'Admin']

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!isModalOpen) {
                setIsEditing(false);
                setIsDeleting(false);
                setSelectedUser({});
            }
          }, 500);
        return () => clearTimeout(timeout);
    }, [isModalOpen])

    const { users, isLoading, isError, mutate } = userService.useUser(
        searchedText, 
        filterText, 
        sortBy,
        filters,
        {
          revalidateOnFocus: false,
          refreshInterval: 30000
        }
    );
    const { insertUser, isInsertLoading, isInsertError } = userService.useUserInsertion();
    const { modifyUser, isModifingLoading, isModifyError } = userService.useModifyUser();
    const { deleteUser, isDeletingLoading, isDeleteError } = userService.useDeleteUser();

    const handleSubmit = async (formData) => {
        const result = await insertUser(formData);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    const handleModify = async (formData) => {
        const result = await modifyUser(formData);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    const handleDeleting = async (_id) => {
        const result = await deleteUser(_id);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    useEffect(() => {
        socket.on('user-item', () => {
            mutate();
        });

        return () => {
            socket.off('user-item');
        };
    }, [mutate]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {isDeleting ?
                    <Dialog isOpen={isModalOpen} isError={isDeleteError} onCancel={() => setIsModalOpen(false)} onDelete={handleDeleting} isLoading={isDeletingLoading} _id={selectedUser._id} name={selectedUser.name} surname={selectedUser.surname}/>
                    :
                    !isEditing ?
                        <UserForm isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleSubmit} isError={isInsertError} isLoading={isInsertLoading} isEditing={isEditing}/>
                        :
                        <UserForm isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleModify} isError={isModifyError} isLoading={isModifingLoading} data={selectedUser} isEditing={isEditing}/>   
                }    
            </Modal>

            <div className="exam-content-container">
                <div className="top-content-container">
                    <div className="data-page-title">
                        <Text variant={'h1'}>{routes.filter(r => r.name.includes(location)).map(r => r.label)}</Text>
                    </div>
                    <Button onlyicon={true} iconName={'plus'} variant={'primary'} size={'big'} onClick={()=>{setIsModalOpen(true);setIsDeleting(false);setIsEditing(false);}}/>
                </div>

                <Separator/>
                <Spacer height={theme.sizes.gap3}/>
                
            
                <Filters onGroupBy={setFilters} filtersSelect={filtersSelect} searchForPlaceholder={searchForPlaceholder} onSelect={setIsTable} onSearchedText={setSearchedText} onSortBy={setSortBy} onFiltersBy={setFilterText}/>
                <Spacer height={theme.sizes.gap3}/>
                {
                isError ?
                    <div className="error-handler">
                        <Text variant={'h1'} color={theme.colors.black50}>{ isError?.response?.data?.message || 'An error occurred'}</Text>
                    </div>
                :
                    users.length === 0 && !isLoading ? 
                        <div className="error-handler">
                            <Text variant={'h1'} color={theme.colors.black50}>{searchedText.length > 1 ? 'No results found' : 'Add a new user'}</Text>
                        </div>
                    :
                        <div className={`data-container-scroll ${isTable ? 'table': 'card'}`}>
                            {
                            isTable ?
                                <TableTemplate data={users} />
                            :
                                <div className="data-container card">
                                    {isLoading ? (
                                        Array.from({ length: userLength || 6 }).map((_, index) => (
                                            <Skeleton key={index} variant="rectangle" width={'100%'} height={259} sx={{ bgcolor: theme.colors.white05, borderRadius: '20px' }}/>
                                        ))
                                    ) : (
                                        users.map((s) => (
                                            <Card
                                                key={s._id}
                                                _id={s._id}
                                                name={s.name}
                                                surname={s.surname}
                                                email={s.email}
                                                admin={s.admin}
                                                onDelete={(userData) => {setSelectedUser(userData);setIsDeleting(true);setIsModalOpen(true);}}
                                                onModify={(userData) => {setSelectedUser(userData);setIsEditing(true);setIsModalOpen(true);}}
                                            />
                                        ))
                                    )}
                                </div>
                            }
                        </div>
                }
            </div>
        </>
    )
}