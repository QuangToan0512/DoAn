/* eslint-disable */
import React from 'react';
import style from '../styles.module.css';
import moment from 'moment';
import {
	Button,
	DatePicker,
	Form,
	Input,
	message as messageAnt,
	Modal,
	Radio,
	Upload,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import baseAPI from '../../../axios/baseAPI';
import { BASE_URL_IMAGE, TypeApi } from '../../../util/TypeApi';
import { UpdateUser } from '../../../actions/userAction';
// import PropTypes from 'prop-types';

// const
const validateMessages = {
	required: '${label} is required!',
	types: {
		email: '${label} is not a valid email!',
		number: '${label} is not a valid number!',
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	},
};
const dateFormat = 'DD-MM-YYYY';
function HoSo(props) {
	// hooks
	const [form] = Form.useForm();
	const myUser = useSelector((state) => state['myUser']);
	const dispatch = useDispatch();

	// state
	const { disabled } = props;
	const [linkFile, setLinkFile] = React.useState('');
	const [fileList, setFileList] = React.useState([]);
	const [value, setValue] = React.useState(1);
	const [date, setDate] = React.useState(null);
	const [previewVisible, setPreviewVisible] = React.useState(false);
	const [previewImage, setPreviewImage] = React.useState('');
	const [previewTitle, setPreviewTitle] = React.useState('');

	// func
	const onChange = (info) => {
		setFileList(info.fileList);
		switch (info.file.status) {
			case 'uploading':
				break;
			case 'done':
				setLinkFile(info.file.response.fileNameInServer);
				break;
			default:
				// message.error(`${info.file.name}`);
				setLinkFile('');
				break;
		}
	};
	const handleCancel = () => setPreviewVisible(false);

	const onChangeDate = (value) => {
		setDate(value);
	};

	const onFinish = async (values) => {
		const newData = { ...values };
		newData.date_of_birth =
			newData['date_of_birth'] !== 'Invalid date' ? moment(date).format() : '';
		newData.gender = Number(value);
		linkFile && (newData['image'] = linkFile);
		if (newData['check_new_password'] === newData['new_password']) {
			const { message, user } = await baseAPI.update(
				`${TypeApi.user}/${myUser._id}`,
				newData
			);
			if (message === 'SUCCESS') {
				messageAnt.success('C???p nh???t th??nh c??ng');
				dispatch(UpdateUser(user));
			} else {
				messageAnt.warn(message);
			}
		} else messageAnt.warn('M???t kh???u kh??ng tr??ng nhau');
	};

	const onChangeRadios = (e) => {
		setValue(`${e.target.value}`);
	};

	// const
	const UpFile = {
		name: 'file',
		action: `${BASE_URL_IMAGE}upload`,
		multiple: true,
		onChange: (info) => onChange(info),
	};
	const linkFileView = linkFile
		? BASE_URL_IMAGE + linkFile
		: 'https://img.icons8.com/cotton/344/image--v1.png';

	// JSX
	React.useEffect(() => {
		const data = { ...myUser };
		data.gender = `${data.gender}`;

		setDate(moment(data.date_of_birth));
		setValue(data.gender.toString());
		if (data.image) {
			setFileList([
				{
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url: BASE_URL_IMAGE + data.image,
				},
			]);
			setLinkFile(data.image);
		}

		delete data.password; // Note: x??a ??i v?? c?? th??? b??? ng?????i kh??c nh??n th???y
		delete data.date_of_birth;
		form.setFieldsValue({ ...data });
	}, [myUser]);
	return (
		<div>
			<div className={style.my_account_profile}>
				<Form
					name="nest-messages"
					onFinish={onFinish}
					validateMessages={validateMessages}
					form={form}
				>
					<div className={style.content_left}>
						<div className={style.my_account_profile__left}>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>T??n :</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item name={'name'}>
										<Input disabled={disabled} />
									</Form.Item>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>Email :</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item name={'email'}>
										<Input disabled={disabled} />
									</Form.Item>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>
									S??? ??i???n tho???i :
								</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item name="phone">
										<Input
											// addonBefore={prefixSelector}
											style={{ width: '100%' }}
											disabled={disabled}
										/>
									</Form.Item>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>
									Gi???i t??nh :
								</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item name={'gender'}>
										<Radio.Group
											onChange={onChangeRadios}
											value={value.toString()}
											defaultValue={value.toString()}
											disabled={disabled}
										>
											<Radio value={'1'}>Nam</Radio>
											<Radio value={'2'}>N???</Radio>
											<Radio value={'3'}>Kh??c</Radio>
										</Radio.Group>
									</Form.Item>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>
									Ng??y sinh :
								</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item>
										<DatePicker
											disabled={disabled}
											format={dateFormat}
											value={date}
											defaultValue={date}
											onChange={onChangeDate}
										/>
									</Form.Item>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>?????a ch??? :</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item name={'address'}>
										<Input.TextArea disabled={disabled} />
									</Form.Item>
								</div>
							</div>
						</div>
						<div className={style.my_account_profile__right}>
							{/*mk hi???n th??? trang h??? s??*/}
							<div
								className={style.my_account_profile__left_item}
								style={{ display: 'none' }}
								id="left_item_password_1"
							>
								<Form.Item label="M???t kh???u HT:" name={'password'}>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
										disabled={disabled}
									/>
								</Form.Item>
							</div>
							{/*mk hi???n th??? trang ch???nh s???a h??? s??*/}
							<div
								className={style.my_account_profile__left_item}
								style={{ display: 'none' }}
								id="left_item_password_2"
							>
								<Form.Item label="M???t kh???u m???i :" name={'new_password'}>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
										disabled={disabled}
									/>
								</Form.Item>
							</div>
							<div
								className={style.my_account_profile__left_item}
								style={{ display: 'none' }}
								id="left_item_password_3"
							>
								<Form.Item label="Nh???p l???i m???t kh???u :" name={'check_new_password'}>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
										disabled={disabled}
									/>
								</Form.Item>
							</div>
							{/*het pass*/}
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>
									???nh avatar :
								</div>
								<div className={style.my_account_profile__left_item_input}>
									<Form.Item>
										<Upload
											{...UpFile}
											listType="picture-card"
											fileList={fileList}
											// onPreview={handlePreview}
											disabled={disabled}
										>
											{linkFile.length <= 0 ? (
												<img
													alt="example"
													src={linkFileView}
													style={{ width: 50, height: 50 }}
												/>
											) : null}
										</Upload>
										<Modal
											visible={previewVisible}
											title={previewTitle}
											footer={null}
											onCancel={handleCancel}
										>
											<img alt="example" style={{ width: '100%' }} src={previewImage} />
										</Modal>
									</Form.Item>
									<div style={{ display: 'none' }} id="chu_y">
										<div>
											Dung l?????ng file t???i ??a 2 MB
											<br />
											?????nh d???ng:.JPEG, .PNG
										</div>
										<div style={{ color: '#f65353' }}>
											* Click v??o ???nh ????? thay ?????i avatar
										</div>
									</div>
								</div>
							</div>
							<div className={style.my_account_profile__left_item}>
								<div className={style.my_account_profile__left_item_title}>
									<Button
										id="left_item_password_4"
										htmlType="submit"
										style={{ backgroundColor: '#ee4d2d', color: '#fff', display: 'none' }}
									>
										L??u
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
}

HoSo.propTypes = {};

HoSo.defaultProps = {};

export default React.memo(HoSo);
