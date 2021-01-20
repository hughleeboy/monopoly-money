import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd'

const AddPlayer = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [name, setName] = useState("Name")
    const [money, setMoney] = useState(1500)

    
    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
        props.onAdd(name, money)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <div style={{margin: '20px'}}>
            <Button type="primary" onClick={showModal}>
               Add Player
            </Button>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div style={{ marginBottom: 16 }}>
                    <Input 
                        addonBefore="Name" 
                        defaultValue={name} 
                        onChange={(value) => setName(value.target.defaultValue)} 
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <Input 
                        addonBefore="Money" 
                        min={0} 
                        max={100000} 
                        defaultValue={money} 
                        onChange={(value) => setMoney(value.target.defaultValue)} 
                    />
                </div>
            </Modal>
        </div>
    )
}

export default AddPlayer