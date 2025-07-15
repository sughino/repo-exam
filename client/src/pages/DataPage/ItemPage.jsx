import { TableTemplate } from "../../components/TableTemplate";
import { ItemCard } from "../../components/SpotlightCard";
import { Skeleton } from '@mui/material';
import { ThemeContext } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Filters } from "../../components/Filters";
import { Spacer } from "../../components/Spacer";
import Text from "../../components/Text";
import { Modal } from "../../components/modal";
import { ItemForm } from "../../components/DataForms";
import { Button } from "../../components/buttons";
import { Separator } from "../../components/Separator";
import { useLocation } from "react-router-dom";
import itemService from "../../services/itemServices";
import categoryService from "../../services/categoryServices";
import { Dialog } from "../../components/dialog";
import socket from "../../utils/socket";
import { useRoutes } from "../../context/RoutesContext" 
import './DataPage.css';

export const ItemPage = () => {
    let location = useLocation().pathname.substring(1);
    const routes = useRoutes();
    const theme = useContext(ThemeContext);
    const itemLength = localStorage.getItem('itemLength');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isTable, setIsTable] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] =  useState(false);
    const [filters, setFilters] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const searchForPlaceholder = "Search by item description";
    const filtersSelect = ['Request id', 'Price', 'Date', 'Quantity'];

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

    const { item, isLoading, isError, mutate } = itemService.useItem(
        searchedText, 
        filterText, 
        sortBy,
        filters,
        {
          revalidateOnFocus: false,
          refreshInterval: 30000
        }
    );
    const { categories, isLoadingCategory } = categoryService.useCategory();
    const { insertItem, isInsertLoading, isInsertError } = itemService.useItemInsertion();
    const { modifyItem, isModifingLoading, isModifyError } = itemService.useModifyItem();
    const { deleteItem, isDeletingLoading, isDeleteError } = itemService.useDeleteItem();

    const handleSubmit = async (formData) => {
        const result = await insertItem(formData);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    const handleModify = async (formData) => {
        if (status !== "pending") return
        const result = await modifyItem(formData);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    const handleDeleting = async (_id) => {
        if (selectedUser.status !== "pending") return
        const result = await deleteItem(_id);
        if (result.success) {
            mutate();
            setIsModalOpen(false);
        }
    }

    useEffect(() => {
        socket.on('item', () => {
            mutate();
        });

        return () => {
            socket.off('item');
        };
    }, [mutate]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {isDeleting ?
                    <Dialog isOpen={isModalOpen} isError={isDeleteError} onCancel={() => setIsModalOpen(false)} onDelete={handleDeleting} isLoading={isDeletingLoading} _id={selectedUser._id} name={selectedUser.name} surname={selectedUser.surname}/>
                    :
                    !isEditing ?
                        <ItemForm loadingCategory={isLoadingCategory} elementList={categories} isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleSubmit} isError={isInsertError} isLoading={isInsertLoading} isEditing={isEditing}/>
                        :
                        <ItemForm loadingCategory={isLoadingCategory} elementList={categories} isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleModify} isError={isModifyError} isLoading={isModifingLoading} data={selectedUser} isEditing={isEditing}/>   
                }    
            </Modal>

            <div className="exam-content-container">
                <div className="top-content-container">
                    <div className="data-page-title">
                        <Text variant={'h1'} className={'title-wrap'}>{routes.filter(r => r.name.includes(location)).map(r => r.label)}</Text>
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
                    item.length === 0 && !isLoading ? 
                        <div className="error-handler">
                            <Text variant={'h1'} color={theme.colors.black50}>{searchedText.length > 1 ? 'No results found' : 'Add a new request'}</Text>
                        </div>
                    :
                        <div className={`data-container-scroll ${isTable ? 'table': 'card'}`}>
                            {
                            isTable ?
                                <TableTemplate data={item} />
                            :
                                <div className="data-container card">
                                    {isLoading ? (
                                        Array.from({ length: itemLength || 6 }).map((_, index) => (
                                            <Skeleton key={index} variant="rectangle" width={'100%'} height={259} sx={{ bgcolor: theme.colors.white05, borderRadius: '20px' }}/>
                                        ))
                                    ) : (
                                        item.map((s) => (
                                            <ItemCard
                                                key={s._id}
                                                _id={s._id}
                                                requesterName={s.requesterName}
                                                requesterSurname={s.requesterSurname}
                                                reqDate={s.requestDate}
                                                category={s.categoryDescription}
                                                description={s.itemDescription}
                                                quantity={s.quantity}
                                                unitCost={s.unitCost}
                                                justification={s.justification}
                                                status={s.status}
                                                approvalDate={s.approvalDate}
                                                approverName={s.approverName}
                                                approverSurname={s.approverSurname}
                                                onDelete={(itemData) => {setSelectedUser(itemData);setIsDeleting(true);setIsModalOpen(true);}}
                                                onModify={(itemData) => {setSelectedUser(itemData);setIsEditing(true);setIsModalOpen(true);}}
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