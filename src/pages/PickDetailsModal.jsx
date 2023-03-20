import React, { useState, useCallback } from 'react';
import {
  Card,
  Button,
  Form,
  TextField,
  Stack,
  Icon,
  Select,
  Checkbox,
  DropZone,
  Image,
} from '@shopify/polaris';
import { editIcon, closeImage, modalstyle } from '../assets';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { useAuthenticatedFetch, useAppQuery } from '../hooks';
import { useNavigate, useParams } from 'react-router-dom';

//start
const PickDetailsModal = ({ buttonText, customContent, oldproduct }) => {
  const navigate = useNavigate();
  let [active, setActive] = useState(false);
  let [priceChecked, setPriceChecked] = useState(false);
  const [file, setFile] = useState(null);
  const fetch = useAuthenticatedFetch();
  const [title, setTitle] = useState(oldproduct ? oldproduct.title : '');
  const [price, setPrice] = useState(
    oldproduct ? oldproduct.variants.edges[0].node.price : ''
  );
  const [description, setDescription] = useState(
    oldproduct ? oldproduct.description : ''
  );
  const [genre, setGenre] = useState(null);
  const { id } = useParams();
  // const [mainFile, setMainFile] = useState(null);

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      console.log('Accepted Files' + acceptedFiles[0]);
      console.log('Rejected Files' + rejectedFiles[0]);

      setFile(acceptedFiles[0]);

      // setMainFile(_droppedFiles[0].File);
    },
    []
  );

  // console.log(title);

  const { refetch: refetchProductDetails } = useAppQuery({
    url: `/api/packs/${id}`,
  });

  // handle update
  const handleUpdate = async () => {
    if (!oldproduct) {
      console.log('product is is not define');
      return;
    }
    const fd = new FormData();
    fd.append(
      'variantid',
      oldproduct.variants.edges[0].node.id.replace(
        'gid://shopify/ProductVariant/',
        ''
      )
    );
    if (file) {
      fd.append('image', file);
    }
    fd.append('title', title);
    fd.append('price', price);

    const response = await fetch(
      `/api/packs/${oldproduct.id.replace('gid://shopify/Product/', '')}`,
      {
        // Adding method type
        method: 'PUT',
        body: fd,
      }
    );

    if (response.ok) {
      setActive(false);
      await refetchProductDetails();
      return;
    } else {
      console.log('something went wrong');
    }
  };

  // handle create

  const handleCreate = async () => {
    const fd = new FormData();
    if (file) {
      fd.append('file', file);
    }
    // setIsLoading(true);
    fd.append('title', title);
    fd.append('price', price);
    fd.append('description', description);

    console.log([...fd]);

    const response = await fetch('/api/packs', {
      // Adding method type
      method: 'POST',
      body: fd,
    });

    if (response.ok) {
      console.log('product created success');
      setActive(false);
      setFile(null);
      setTitle('');
      setPrice('');
      return navigate('/');
    } else {
      console.log('Something went wrong');
    }
  };

  // const imgurl = window.URL.createObjectURL(file);

  //handling the modal close
  const modalClose = () => {
    setActive(false);
    setFile(null);
    setTitle('');
    setPrice('');
  };

  return (
    <>
      {(buttonText && (
        <Button
          primary
          onClick={() => {
            setActive(true);
          }}
        >
          {buttonText}
        </Button>
      )) ||
        (customContent && (
          <div
            onClick={() => {
              setActive(true);
            }}
          >
            {customContent}
          </div>
        ))}
      {active && (
        <div className="modal">
          <div className="modalContent">
            <button
              className="closeIcon"
              onClick={() => {
                modalClose();
              }}
            >
              <Icon source={MobileCancelMajor} color="base" />
            </button>
            <Card sectioned>
              <Form
                onSubmit={() => {
                  console.log('Inside form submit handler');
                }}
              >
                <Stack vertical>
                  <Stack distribution="center" element="h3">
                    <h3 element="h2" className="packDetailsHeading">
                      PACK DETAILS
                    </h3>
                  </Stack>

                  <Stack distribution="fill" spacing="baseTight" vertical>
                    <input
                      className="title-input"
                      type="text"
                      placeholder="Pack Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <Select
                      label="Pack Title"
                      labelHidden
                      placeholder="Genre(!)"
                      onChange={(e) => setGenre(e.target.value)}
                      options={[
                        { label: 'option 1', value: 'option1' },
                        { label: 'option 2', value: 'option2' },
                      ]}
                    />
                    <textarea
                      type="text"
                      className="text-area-field"
                      placeholder="Descriptions"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Checkbox
                      label={<p className="checkbox">Set Price</p>}
                      checked={priceChecked}
                      onChange={(newChecked) => {
                        setPriceChecked(newChecked);
                      }}
                    />
                    {priceChecked && (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="999999"
                        className="price"
                        placeholder="$50.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    )}
                    <Stack vertical>
                      <DropZone
                        label={
                          <p className="dropzoneLabel">Set Pack Thumbnail</p>
                        }
                        type="image"
                        accept="image/*"
                        onDrop={handleDrop}
                      >
                        {!file && <DropZone.FileUpload />}
                        {file && (
                          <div
                            className="fileContainter"
                            style={{
                              backgroundImage: `url(${window.URL.createObjectURL(
                                file
                              )})`,
                            }}
                          >
                            <p className="fileChangeTitle">Change</p>
                            <Image
                              source={editIcon}
                              width="13px"
                              height="13px"
                            />
                          </div>
                        )}
                      </DropZone>
                      {file && (
                        <div
                          onClick={() => setFile(null)}
                          className="imageClearContainer"
                        >
                          <Stack spacing="tight" alignment="center">
                            <a className="imageClear">Clear</a>
                            <Image
                              source={closeImage}
                              width="9px"
                              height="9px"
                            />
                          </Stack>
                        </div>
                      )}
                    </Stack>
                  </Stack>
                  <Stack distribution="center">
                    {oldproduct ? (
                      <Button onClick={handleUpdate} primary>
                        Update
                      </Button>
                    ) : (
                      <Button onClick={handleCreate} primary>
                        Create
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default PickDetailsModal;
