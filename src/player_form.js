import * as React from 'react'
import { Form, Select, InputNumber, Input, Button } from 'antd'
  
const { Option } = Select
const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }
  

const TransferForm = (props) => {
    const onFinish = (values) => {
        props.onSubmit(values)
    }
  
    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
        >

            <Form.Item
                name="player"
                label="Player Name"
                rules={[{ required: true }]}
            >
                <Input placeholder="Who is joining the game?" />
            </Form.Item>

            <Form.Item 
                name="amount" 
                label="Money"
                rules={[{ required: true }]}
            >
                <InputNumber style={{width: "100%"}} placeholder="How much money are they starting with?" min={0} max={5000} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

        </Form>
    )
}

export default TransferForm