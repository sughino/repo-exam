import { TableTemplate } from "../../components/TableTemplate";
import { ItemCard, UserCard } from "../../components/SpotlightCard";
import { Skeleton } from '@mui/material';
import { ThemeContext } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Filters } from "../../components/Filters";
import { Spacer } from "../../components/Spacer";
import Text from "../../components/Text";
import { Modal } from "../../components/modal";
import { Separator } from "../../components/Separator";
import { useLocation } from "react-router-dom";
import otherItemService from "../../services/otherItemServices";
import { Dialog } from "../../components/dialog";
import socket from "../../utils/socket";
import { useRoutes } from "../../context/RoutesContext" 
import './DataPage.css';

export const OtherItemPage = () => {
let location = useLocation().pathname.substring(1);
    const routes = useRoutes();
    const theme = useContext(ThemeContext);
    const itemLength = localStorage.getItem('otherItemLength');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isTable, setIsTable] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] =  useState(false);
    const [filters, setFilters] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const searchForPlaceholder = "Search by requester name or surname";
    const filtersSelect = ['Request id', 'Price', 'Date', 'Quantity'];

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!isModalOpen) {
                setSelectedItem({});
            }
          }, 500);
        return () => clearTimeout(timeout);
    }, [isModalOpen])

    const { item, isLoading, isError, mutate } = otherItemService.useItem(
        searchedText, 
        filterText, 
        sortBy,
        filters,
        {
          revalidateOnFocus: false,
          refreshInterval: 30000
        }
    );
    const { modifyItem, isModifingLoading, isModifyError } = otherItemService.useModifyItem();

    const handleReject = async (_id) => {
        const result = await modifyItem(_id, "rejected");
        if (result.success) {
            mutate();
        }
    }
    const handleApprove = async (item) => {
        const result = await modifyItem(item._id, "approved");
        if (result.success) {
            mutate();
        }
    }

    useEffect(() => {
        socket.on('otherItem', () => {
            mutate();
        });

        return () => {
            socket.off('otherItem');
        };
    }, [mutate]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Dialog isRequest={true} isOpen={isModalOpen} isError={isModifyError} onCancel={() => setIsModalOpen(false)} onDelete={handleReject} isLoading={isModifingLoading} _id={selectedItem?._id}/>
            </Modal>

            <div className="exam-content-container">
                <div className="top-content-container">
                    <div className="data-page-title">
                        <Text variant={'h1'} className={'title-wrap'}>{routes.filter(r => r.name.includes(location)).map(r => r.label)}</Text>
                    </div>
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
                            <Text variant={'h1'} color={theme.colors.black50}>{searchedText.length > 1 ? 'No results found' : 'There are no new request'}</Text>
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
                                                admin={true}
                                                onDelete={(itemData) => {setSelectedItem(itemData);setIsModalOpen(true);}}
                                                onModify={(itemData) => {handleApprove(itemData)}}
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