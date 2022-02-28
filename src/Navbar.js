import React, { useState } from 'react';
import { Menu,Avatar }            from "antd";
import { UserOutlined } from '@ant-design/icons';

const Navbar = () => {
    const [ current, setCurrent ] = useState('mail');

    const handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };
    return (
        <div>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="mail" icon={<Avatar icon={<UserOutlined />} />}>
                    Profile
                </Menu.Item>
                <Menu.Item key="alipay">
                    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                        Transition History
                    </a>
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Navbar;
