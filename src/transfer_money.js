import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import TransferForm from './transfer_form'

const AddPlayer = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleSubmit = (values) => {
        setIsModalVisible(false)
        props.onTransfer(values)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <div>
            <Button type="secondary" onClick={showModal}>
               {props.type === "transfer" ? "Transfer Money" : "Spend Money"}
            </Button>
            <Modal footer={null} title="Basic Modal" visible={isModalVisible} onCancel={handleCancel}>
                <TransferForm type={props.type} onSubmit={handleSubmit} players={props.players} />
            </Modal>
        </div>
    )
}

export default AddPlayer