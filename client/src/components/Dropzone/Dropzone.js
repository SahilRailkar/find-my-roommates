import axios from 'axios';
import React, { useContext } from 'react';
import { useDropzone } from 'react-dropzone';

import { useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ModalContext } from '../../contexts/ModalContext';
import { GET_SIGNED_URLS } from '../../graphql/mutations';

const getColor = (props) => {
	if (props.isDragAccept) {
		return '#00e676';
	}
	if (props.isDragReject) {
		return '#ff1744';
	}
	if (props.isDragActive) {
		return '#2196f3';
	}
	return '#eeeeee';
};

const Dropzone = ({ onUpload, setLoading }) => {
	const { hideModal } = useContext(ModalContext);
	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({ accept: 'image/*' });

	const uploadToS3 = async (file, signedUrl) => {
		const options = {
			headers: {
				'Content-Type': file.type,
				'x-amz-tagging': 'expires=true',
			},
		};
		await axios.put(signedUrl, file, options).catch((err) => {
			if (err.response) {
				// Request made and server responded
				console.log(err.response.data);
				console.log(err.response.status);
				console.log(err.response.headers);
			} else if (err.request) {
				// The request was made but no response was received
				console.log(err.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', err.message);
			}
		});
	};

	const [getSignedUrls] = useMutation(GET_SIGNED_URLS, {
		onCompleted: async (data) => {
			const signedUrls = data.getSignedUrls;
			for (let i = 0; i < signedUrls.length; ++i) {
				const file = acceptedFiles[i];
				const { signedUrl } = signedUrls[i];
				await uploadToS3(file, signedUrl);
			}
			const urls = signedUrls.map(({ url }) => {
				return url;
			});
			onUpload(urls);
			setLoading(false);
		},
	});

	const createKey = (filename) => {
		const date = new Date().valueOf();
		const cleanFilename = filename.replace(/[^0-9a-zA-Z/!-_.*'()]/g, '-');
		const splitFilename = cleanFilename.split('.');
		const newFilename = `images/${splitFilename[0]}_${date}.${splitFilename[1]}`;
		return newFilename.substring(0, 1024);
	};

	const handleClickUploadButton = async () => {
		setLoading(true);
		getSignedUrls({
			variables: {
				files: acceptedFiles.map((file) => {
					return {
						key: createKey(file.name),
						contentType: file.type,
					};
				}),
			},
		});
		hideModal();
	};

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	return (
		<div>
			<Box
				{...getRootProps({ isDragActive, isDragAccept, isDragReject })}
				sx={{
					alignItems: 'center',
					backgroundColor: '#fafafa',
					border: `2px dashed ${getColor({
						isDragActive,
						isDragAccept,
						isDragReject,
					})}`,
					color: '#bdbdbd',
					display: 'flex',
					flex: 1,
					flexDirection: 'column',
					outline: 'none',
					p: '20px',
					transition: 'border 0.24s ease-in-out',
				}}
			>
				<input {...getInputProps()} />
				<p>Drag 'n' drop some images here, or click to select images</p>
			</Box>
			<div>
				{files.length !== 0 && <h4>Images</h4>}
				<ul>{files}</ul>
			</div>
			<Button
				onClick={handleClickUploadButton}
				size="large"
				sx={{ width: '100%' }}
				variant="contained"
			>
				Upload
			</Button>
		</div>
	);
};

export default Dropzone;
