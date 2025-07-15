import { useContext } from 'react';
import { SpotlightCard } from './SpotlightCard';
import { ThemeContext } from 'styled-components';
import Text from '../Text';
import { Button } from '../buttons';
import { Separator } from '../Separator';
import { Icon } from '../Icon';
import { FadeIn } from '../FadeIn';
import './cardType.css';

export const UserCard = ({
    _id,
    name,
    surname,
    email,
    admin,
    regDate,
    onModify,
    onDelete,
}) => {
    const theme = useContext(ThemeContext);
    const userData = {
        _id: _id,
        name: name,
        surname: surname,
        email: email,
        regDate: regDate,
        admin: admin
    };

    return (
        <FadeIn size={'100%'}>
            <SpotlightCard className='main-card' spotlightColor={theme.colors.white20}>
                {
                    admin && (
                        <div className="admin-container">
                            <Icon name={'shield'} size={24} color={theme.colors.white}/>
                        </div>
                    )
                }
                <div className="card-content-container">
                    <div className="card-top-content-container">
                        <Text variant={'h6'} color={theme.colors.white30}>{regDate}</Text>
                        <Text variant={'h4'} className={'card-ellipsis card-capitalized'}>{name} {surname}</Text>
                    </div>
                    <Separator color={theme.colors.white10}/>
                    <div className="card-top-content-container">
                        <Text variant={'subtitle'}>{email}</Text>
                    </div>
                </div>

                <div className="card-button-container">
                    <Button onlyicon={true} iconName={'trash'} variant={'secondaryWarning'} size={'big'} style={{width: '100%'}} onClick={() => onDelete(userData)}/>
                    <Button onlyicon={true} iconName={'pencil'} variant={'accent'} size={'big'} style={{width: '100%'}} onClick={() => onModify(userData)}/>
                </div>
            </SpotlightCard>
        </FadeIn>
    )
}

export const ItemCard = ({
    _id,
    requesterName,
    requesterSurname,
    reqDate,
    category,
    description,
    quantity,
    unitCost,
    justification,
    status,
    approvalDate,
    approverName,
    approverSurname,
    onModify,
    onDelete,
    admin = false
}) => {
    const theme = useContext(ThemeContext);
    const itemData = {
        _id: _id,
        reqDate: reqDate,
        unitCost: unitCost,
        quantity: quantity,
        description: description,
        justification: justification,
        status: status
    };

    return (
        <FadeIn size={'100%'}>
            <SpotlightCard className='main-card' spotlightColor={theme.colors.white20}>
                <div className="admin-container" style={{
                    backgroundColor: status === 'pending' ? theme.colors.waiting10 :
                                    status === 'approved' ? theme.colors.success10 :
                                    status === 'rejected' ? theme.colors.warning10 : 'transparent'
                    }}>
                    <Icon name={
                        status === 'pending' ? 'clock' :
                        status === 'approved' ? 'check-circle' :
                        status === 'rejected' ? 'x-circle' :
                        'help-circle'
                    } size={24} color={theme.colors.white}/>
                </div>
                <div className="card-content-container">
                    <div className="card-top-content-container">
                        <Text variant={'h6'} color={theme.colors.white30}>{reqDate}</Text>
                        <Text variant={'h4'} className={'card-ellipsis card-capitalized'}>
                            {admin ? `${requesterName} ${requesterSurname}` : category}
                        </Text>
                        {admin && (
                            <Text variant={'h5'} className={'card-ellipsis card-capitalized'}>{category}</Text>
                        )}
                    </div>

                    <Separator color={theme.colors.white10}/>
                    <div className="card-top-content-container">
                            <Text variant={'body2'}>description:</Text>
                            <Text variant={'body'} className={'card-ellipsis card-capitalized'}>{description}</Text>
                    </div>
                    <div className="card-top-content-container">
                        <Text variant={'body2'}>justification:</Text>
                        <Text variant={'body'} className={'card-ellipsis card-capitalized'}>{justification}</Text>
                    </div>

                    <Separator color={theme.colors.white10}/>
                    <div className="card-content-bottom-wrapper">
                        <div className="card-content-container-horizontal">
                            <Text variant={'h6'}>{quantity} unit</Text>
                            <Text variant={'h6'}>{unitCost} $</Text>
                        </div>
                        { status !== 'pending' && (
                            <div className="card-content-container-horizontal">
                                <Text variant={'h6'}>{approvalDate}</Text>
                                <Text variant={'h6'}>{approverName} {approverSurname}</Text>
                            </div>
                            )
                        }
                    </div>
                </div>
                { status === 'pending' && (
                    <div className="card-button-container">
                        <Button onlyicon={true} iconName={admin ? 'x' : 'trash'} variant={'secondaryWarning'} size={'big'} style={{width: '100%'}} onClick={() => onDelete(itemData)}/>
                        <Button onlyicon={true} iconName={admin ? 'check' : 'pencil'} variant={admin ? 'success' : 'accent'} size={'big'} style={{width: '100%'}} onClick={() => onModify(itemData)}/>
                    </div>
                    )
                }
            </SpotlightCard>
        </FadeIn>
    )
}

export const DeliveryCard = ({
    withdrawalDate,
    deliveryDate,
    state,
    keyDelivery,
    address,
    city,
    province,
    phoneNumber,
    note
}) => {
    const theme = useContext(ThemeContext);

    const IconStateMap = {
        'Delivered': 'package-check',
        'Pending': 'clock',
        'Cancelled': 'package-x',
        'Shipped': 'truck'
    };

    return (
        <FadeIn size={'100%'}>
            <SpotlightCard className='main-card' spotlightColor={theme.colors.white20}>
                <div className="card-content-container">
                    <div className="card-top-content-container">
                        <Text variant={'h6'} color={theme.colors.white30}>{keyDelivery}</Text>
                        <div className="card-content-container-horizontal">
                            <Text variant={'h4'} className={'card-ellipsis'}>{state}</Text>
                            <Icon name={IconStateMap[state]} size={26}/>
                        </div>
                    </div>

                    <Separator color={theme.colors.white10}/>

                    <div className="card-content-bottom-wrapper">
                        <div className="card-content-container-horizontal">
                            <Text variant={'body2'}>Withdrawal date:</Text>
                            <Text variant={'body'}>{withdrawalDate}</Text>
                        </div>
                        <div className="card-content-container-horizontal">
                            <Text variant={'body2'}>Delivery date:</Text>
                            <Text variant={'body'}>{deliveryDate}</Text>
                        </div>
                    </div>

                    <Separator color={theme.colors.white10}/>

                    <div className="card-content-container-horizontal larger">
                        <div className="card-bottom-content-container">
                            <div className="card-content-container-horizontal">
                                <Icon name={'map-pin-house'} size={20}/>
                            </div>
                            <div className="card-content-bottom-wrapper">
                                <div className="card-content-container-horizontal">
                                    <Text variant={'body'}>{address}</Text>
                                </div>
                                <div className="card-content-container-horizontal">
                                    <Text variant={'body'}>{city}&nbsp;({province})</Text>
                                </div>
                            </div>    
                        </div>

                        <div className="card-content-container-horizontal">
                            <Icon name={'phone'} size={20}/>
                            <Text variant={'body'}>{phoneNumber}</Text>
                        </div>   
                    </div>

                    <Separator color={theme.colors.white10}/>

                    <div className="card-content-bottom-wrapper">
                        <Text variant={'body2'}>Additional note:</Text>
                        <Text variant={'body'}>{note && 'There is no additional note'}</Text>
                    </div>
                </div>
            </SpotlightCard>
        </FadeIn>
    )
}