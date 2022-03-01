import React, { useEffect, useState } from 'react';
import { Menu, Avatar, Modal }        from "antd";
import { UserOutlined }               from '@ant-design/icons';
import axios                          from "axios";

const Navbar = ({ address }) => {
    const [ isModalVisible, setIsModalVisible ]                       = useState(false);
    const [ isModalTransitionsVisible, setIsModalTransitionsVisible ] = useState(false);
    const [ customerData, setCustomerData ]                           = useState({});
    const [ transitions, setTransitions ]                             = useState({});

    const getUser = async () => {
        await axios({
            method: "get",
            url: `http://192.168.66.125:9999/api/v1.0/user/${ address }`,
        })
            .then(response => {
                setCustomerData(response.data.data)
            })
            .catch(Error => {
                console.log(Error)
            });
    }

    const getTransitions = async () => {
        await axios({
            method: "get",
            url: `http://192.168.66.125:9999/api/v1.0/transaction?wallet=${address}`,
        })
            .then(response => {
                console.log('TRANSITION', response.data.data[0]);
                setTransitions(response.data.data[0]);
            })
            .catch(Error => {
                console.log(Error);
            })
    }

    const handleGetProfile       = e => {
        getUser();
        setIsModalVisible(true);
    };
    const handleGetTransitions   = e => {
        getTransitions();
        setIsModalTransitionsVisible(true);

    }
    const handleOk               = () => {
        setIsModalVisible(false);
    };
    const handleOkTransition     = () => {
        setIsModalTransitionsVisible(false);
    };
    const handleCancel           = () => {
        setIsModalVisible(false);
    };
    const handleCancelTransition = () => {
        setIsModalTransitionsVisible(false);
    };
    return (
        <div>
            <Modal visible={ isModalVisible } onOk={ handleOk } onCancel={ handleCancel }>
                <div>
                    { `Tên khách hàng: ${ customerData.full_name }` }
                </div>
                <div>
                    { `Số điện thoai : ${ customerData.phone }` }
                </div>
            </Modal>

            <Modal visible={ isModalTransitionsVisible } onOk={ handleOkTransition } onCancel={ handleCancelTransition }>
                <div>
                    { `Địa chỉ ví: ${ transitions.wallet }` }
                </div>
                <div>
                    { `Block : ${ transitions.block }` }
                </div>
                <div>
                    { `Fee : ${ transitions.fee }` }
                </div>
                <div>
                    { `Value : ${ transitions.value }` }
                </div>
                <div>
                    { `Status : ${ transitions.status }` }
                </div>
            </Modal>

            <Menu mode="horizontal">
                <Menu.Item onClick={ handleGetProfile } key="profile" icon={ <Avatar icon={ <UserOutlined/> }/> }>
                    User's Profile
                </Menu.Item>

                <Menu.Item onClick={ handleGetTransitions } key="transition_history">
                    History
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Navbar;
