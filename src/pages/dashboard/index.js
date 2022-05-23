import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Button from 'components/Button'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'slices/app.slice'
import { firestore } from 'utils/firebase'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.app)

  const [data, setData] = useState({
    text: ''
  })

  const loadData = async () => {
    const tableData = (await firestore.collection('DATA')
      .doc(me?.id)
      .get())
      .data()

    const databaseText = tableData.text

    if (data.text !== databaseText) {
      setData({ ...data, text: databaseText })
    }
  }

  const saveChanges = async () => {
    await firestore.collection('DATA')
      .doc(me?.id)
      .set({ ...data })
      .then(() => loadData())

    // if success
  }

  useEffect(() => loadData(), [])

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h3 className={styles.greeting}>{`Hi👋, ${me?.fullName || 'User'}`}</h3>
        <div className='rich-text-container'>
          <CKEditor
            editor={ClassicEditor}
            data={data.text}
            onChange={(event, editor) => {
              const editorData = editor.getData()
              if (editorData !== data.text) {
                setData({ ...data, text: editorData })
              }
            }}
          />
          <div className={styles.formActions}>
            <Button
              label="Save"
              className={`btn-purple-outline ${styles.download}`}
              onClick={() => {
                saveChanges()
              }}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Logout"
            className={`btn-purple-outline ${styles.logout}`}
            onClick={() => dispatch(actions.logout())}
          />
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {}
Dashboard.defaultProps = {}

export default Dashboard
