// TODO: In mehrere Klassen aufsplitten und Unions verwenden
export module TranslationModel {
    export class Buttons {
        back?: {
            tooltip?: String
        };
        add?: {
            tooltip?: String
        };
        edit?: {
            tooltip?: String
        };
        delete?: {
            deleteTooltip?: String,
            toggleTooltip?: String
        };
    }
    export class Date {
        dateFormat?: String;
        dateTimeFormat?: String;
    }
    export class Weekdays {
        short?: {
            monday?: String,
            tuesday?: String,
            wednesday?: String,
            thursday?: String,
            friday?: String,
            saturday?: String,
            sunday?: String
        };
    }
    export class Months {
        short?: {
            january?: String,
            february?: String,
            march?: String,
            april?: String,
            may?: String,
            june?: String,
            july?: String,
            august?: String,
            september?: String,
            october?: String,
            november?: String,
            december?: String
        };
        long?: {
            january?: String,
            february?: String,
            march?: String,
            april?: String,
            may?: String,
            june?: String,
            july?: String,
            august?: String,
            september?: String,
            october?: String,
            november?: String,
            december?: String
        };
    }
    export class Dashboard {
        title?: String;
        order?: String;
        management?: String;
        system?: String;
        accountQuestion?: String;
        accountCreation?: String;
        buttons?: {
            login?: String
        };
    }
    export class Upload {
        labels?: {
            title?: String,
            dropzone?: String,
            multiple?: String,
            name?: String,
            type?: String,
            size?: String,
            actions?: String,
            queueTitle?: String,
            removeAllButton?: String,
            spinnerLoadingText?: String
        };
    }
    export class Navigation {
        title?: String;
        login?: String;
        logout?: String;
        register?: String;
        privacyPolicy?: String;
        imprint?: String;
    }
    export class Languages {
        title?: String;
        german?: String;
        english?: String;
        danish?: String;
        de?: String;
        en?: String;
        dk?: String;
    }
    export class Dropdown {
        machines?: {
            title?: String,
            listMachines?: String,
            createMachine?: String,
            listSuccessfulOrders?: String
        };
        orders?: {
            title?: String,
            listOrders?: String,
            createOrder?: String,
            createShared?: String,
            outstandingOrders?: String,
            unfinishedOrders?: String,
            myOrders?: String
        };
        iotDevices?: {
            title?: String,
            createIotDevice?: String,
            listIotDevices?: String
        };
        users?: {
            title?: String,
            signUp?: String,
            login?: String,
            profile?: String,
            listUsers?: String
        };
        fablabs?: {
            title?: String,
            signUp?: String,
            profile?: String,
            listFablabs?: String
        };
    }
    export class DeviceTypes {
        lasercutter?: String;
        otherMachine?: String;
        millingMachine?: String;
        '3d-printer'?: String;
        unknown?: String;
    }
    export class MaterialTypes {
        printerMaterial?: String;
    }
    export class Status {
        new?: String;
        assigned?: String;
        production?: String;
        shipment?: String;
        archived?: String;
        representive?: String;
        deleted?: String;
        completed?: String;
    }
    export class Roles {
        guest?: String;
        user?: String;
        editor?: String;
        admin?: String;
    }
    export class IotDeviceList {
        paginationLabel?: String;
        spinnerLoadingText?: String;
        buttons?: {
            deleteLabel?: String,
            detailLabel?: String
        };
        modals?: {
            yes?: String,
            abort?: String,
            abortValue?: String,
            deleteValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String,
            deleteWarning?: String
        };
        filterLabel?: {
            search?: String
        };
    }
    export class MachineList {
        paginationLabel?: String;
        filterLabel?: {
            type?: String,
            search?: String,
            fablab?: String,
            activation?: String
        };
        spinnerLoadingText?: String;
        buttons?: {
            deleteLabel?: String,
            toggleLabel?: String,
            updateLabel?: String
        };
        modals?: {
            yes?: String,
            abort?: String,
            deleteValue?: String,
            abortValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String
        };
        activations?: {
            active?: String,
            inactive?: String
        };
    }
    export class MachineForm {
        createTitle?: String;
        editTitle?: String;
        generalData?: String;
        labels?: {
            create?: String,
            edit?: String,
            deviceName?: String,
            fablab?: String,
            manufacturer?: String,
            data?: String,
            camSoftware?: String,
            nozzleDiameter?: String,
            materials?: String,
            printVolume?: String,
            printResolution?: String,
            numberOfExtruders?: String,
            comment?: String,
            movementSpeed?: String,
            stepSize?: String,
            workspace?: String,
            laserTypes?: String,
            laserPower?: String,
            maxResolution?: String,
            typeOfMachine?: String,
            isActivated?: String,
            informationLink?: String
        };
        buttons?: {
            activatedTrue?: String,
            activatedFalse?: String
        };
        modals?: {
            ok?: String,
            error?: String,
            updatingError?: String,
            updatingSuccessHeader?: String,
            updatingSuccessMsg?: String,
            creatingSuccessHeader?: String,
            creatingSuccessMsg?: String
        };
        messages?: {
            deviceName?: String,
            fablab?: String,
            manufacturer?: String,
            typeOfMachine?: String
        };
    }
    export class MachineDetail {
        labels?: {
            active?: String,
            inactive?: String
        };
        titles?: {
            machineProps?: String,
            laserTypes?: String,
            fablab?: String,
            materials?: String,
            successfulOrders?: String,
            schedules?: String
        };
        modals?: {
            yes?: String,
            no?: String,
            deleteReturnValue?: String,
            abortReturnValue?: String,
            deleteHeader?: String,
            deleteMessage?: String,
            deleteMessage2?: String
        };
        buttons?: {
            toggleTooltip?: String
        };
        props?: {
            activated?: String,
            deviceName?: String,
            type?: String,
            manufacturer?: String,
            workspaceX?: String,
            workspaceY?: String,
            workspaceZ?: String,
            maxResolution?: String,
            laserPower?: String,
            comment?: String,
            name?: String,
            phone?: String,
            mail?: String,
            laserType?: String,
            material?: String,
            camSoftware?: String,
            movementSpeed?: String,
            stepSize?: String,
            typeOfMachine?: String,
            printVolumeX?: String,
            printVolumeY?: String,
            printVolumeZ?: String,
            printResolutionX?: String,
            printResolutionY?: String,
            printResolutionZ?: String,
            nozzleDiameter?: String,
            numberOfExtruders?: String,
            street?: String,
            zipCode?: String,
            city?: String,
            country?: String,
            projectname?: String,
            shownStartDate?: String,
            shownEndDate?: String,
            informationLink?: String
        };
    }
    export class UserList {
        title?: String;
        spinnerLoadingText?: String;
        paginationLabel?: String;
        filterLabel?: {
            roles?: String,
            fablabs?: String,
            search?: String
        };
        buttons?: {
            deleteLabel?: String,
            updateLabel?: String
        };
        modals?: {
            yes?: String,
            abort?: String,
            deleteValue?: String,
            abortValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String
        };
        badges?: {
            active?: String,
            inactive?: String
        };
    }
    export class OrderList {
        paginationLabel?: String;
        filterLabel?: {
            machines?: String,
            status?: String,
            fablabs?: String,
            startDay?: String,
            endDay?: String,
            search?: String
        };
        spinnerLoadingText?: String;
        buttons?: {
            deleteLabel?: String,
            updateLabel?: String
        };
        modals?: {
            yes?: String,
            abort?: String,
            deleteValue?: String,
            abortValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String,
            deleteWarning?: String
        };
        messages?: {
            datePicker?: String
        };
    }
    export class Address {
        street?: String;
        zipCode?: String;
        city?: String;
        country?: String;
    }
    export class IotDeviceDetail {
        labels?: {
            deviceId?: String,
            mqttHeader?: String,
            username?: String,
            password?: String,
            dataformat?: String,
            clientId?: String,
            deviceType?: String
        };
        modals?: {
            ok?: String,
            abort?: String,
            abortReturnValue?: String,
            deleteReturnValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteWarning?: String
        };
    }
    export class IotDevicesForm {
        createTitle?: String;
        buttons?: {
            deleteTooltip?: String
        };
        labels?: {
            deviceId?: String,
            deviceType?: String,
            submit?: String
        };
        messages?: {
            deviceId?: String,
            deviceId2?: String,
            deviceId3?: String,
            eventsNotValid?: String
        };
        modals?: {
            ok?: String,
            errorHeader?: String,
            successHeader?: String,
            username?: String,
            password?: String,
            dataformat?: String,
            saveHint?: String
        };
    }
    export class OrderForm {
        createTitle?: String;
        editTitle?: String;
        publicHint?: String;
        privateHint?: String;
        labels?: {
            editSubmit?: String,
            createSubmit?: String,
            sendComment?: String,
            projectName?: String,
            owner?: String,
            editor?: String,
            status?: String,
            machineType?: String,
            selectedMachine?: String,
            selectedMachineInfo?: String,
            comments?: String,
            newComment?: String,
            author?: String,
            content?: String,
            createdAt?: String,
            addressTitle?: String,
            shippingAddresses?: {
                userAddress?: String,
                fablabAddress?: String,
                newAddress?: String
            },
            fileUpload?: String,
            files?: String,
            file?: String,
            latestVersion?: String,
            datePickerStart?: String,
            datePickerEnd?: String,
            timePickerStart?: String,
            timePickerEnd?: String,
            machineSchedule?: String,
            startDate?: String,
            endDate?: String,
            copyright?: String,
            fablab?: String,
            batchTitle?: String,
            batchDescription?: String,
            batchNumber?: String
        };
        modals?: {
            ok?: String,
            okReturnValue?: String,
            createCommentError?: String,
            createCommentSuccessHeader?: String,
            createCommentSuccess?: String,
            createOrderSuccessHeader?: String,
            updateOrderSuccessHeader?: String,
            createOrderSuccess?: String,
            updateOrderSuccess?: String,
            errorHeader?: String,
            updateError?: String,
            createError?: String,
            orderSharedLinkSuccessHeader?: String,
            orderSharedLinkSuccess?: String
        };
        messages?: {
            projectName?: String,
            owner?: String,
            status?: String,
            statusDeprecated?: String,
            machineType?: String,
            selectedMachine?: String,
            unnamedFablab?: String,
            author?: String,
            content?: String,
            datePicker?: String,
            timePicker?: String,
            copyright?: String,
            street?: String,
            zipCode?: String,
            city?: String,
            country?: String
        };
    }
    export class FablabDetail {
        labels?: {
            name?: String,
            address?: {
                title?: String,
                street?: String,
                city?: String,
                zipCode?: String,
                country?: String
            }
        };
        modals?: {
            ok?: String,
            abort?: String,
            deactivateReturnValue?: String,
            abortReturnValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String
        };
        badges?: {
            active?: String,
            inactive?: String
        };
    }
    export class UserDetail {
        labels?: {
            username?: String,
            firstname?: String,
            lastname?: String,
            email?: String,
            address?: {
                title?: String,
                street?: String,
                city?: String,
                zipCode?: String,
                country?: String
            },
            activated?: String,
            role?: String,
            preferredLanguage?: String,
            fablab?: String
        };
        modals?: {
            ok?: String,
            abort?: String,
            deactivateReturnValue?: String,
            abortReturnValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String
        };
        badges?: {
            active?: String,
            inactive?: String
        };
    }
    export class OrderDetail {
        buttons?: {
            tooltips?: {
                delete?: String,
                print?: String
            }
        };
        labels?: {
            owner?: String,
            editor?: String,
            status?: String,
            createdAt?: String,
            machine?: String,
            machineNotSet?: String,
            fablab?: String,
            comments?: String,
            author?: String,
            content?: String,
            files?: String,
            file?: String,
            addressTitle?: String,
            latestVersion?: String,
            scheduledFor?: String,
            batched?: String,
            batchAssigned?: String,
            batchOpen?: String,
            batchFinished?: String,
            imanufacture?: String,
            count?: String,
            helpnow?: String
        };
        modals?: {
            ok?: String,
            abort?: String,
            cancel?: String,
            deleteReturnValue?: String,
            abortReturnValue?: String,
            cancelReturnValue?: String,
            deleteHeader?: String,
            deleteQuestion?: String,
            deleteQuestion2?: String,
            deleteWarning?: String,
            printHeader?: String,
            addressLabel?: String,
            apiKeyLabel?: String,
            fileSelectLabel?: String,
            batchOrderQuestion?: String,
            batchOrderWarning?: String,
            batchOrderAccept?: String,
            batchOrderAbort?: String
        };
    }
    export class UserForm {
        createTitle?: String;
        editTitle?: String;
        labels?: {
            username?: String,
            firstName?: String,
            secondName?: String,
            password?: String,
            passwordValidation?: String,
            email?: String,
            role?: String,
            isActivated?: String,
            createSubmit?: String,
            editSubmit?: String,
            fablab?: String,
            changePassword?: String,
            preferredLanguage?: String
        };
        modals?: {
            ok?: String,
            okReturnValue?: String,
            createSuccessHeader?: String,
            updateSuccessHeader?: String,
            createSuccess?: String,
            updateSuccess?: String,
            errorHeader?: String,
            updateError?: String,
            createError?: String,
            updatePasswordSuccessHeader?: String,
            updatePasswordSuccess?: String,
            updatePasswordErrorHeader?: String,
            updatePassworderror?: String
        };
        messages?: {
            username?: String,
            firstName?: String,
            secondName?: String,
            password?: String,
            passwordValidation?: String,
            passwordValidationWrong?: String,
            email?: String,
            role?: String,
            street?: String,
            zipCode?: String,
            city?: String,
            country?: String,
            notAssigned?: String,
            preferredLanguage?: String
        };
        buttons?: {
            activatedTrue?: String,
            activatedFalse?: String,
            changePassword?: String
        };
    }
    export class FablabForm {
        createTitle?: String;
        editTitle?: String;
        labels?: {
            name?: String,
            isActivated?: String,
            createSubmit?: String,
            editSubmit?: String,
            fablab?: String
        };
        modals?: {
            ok?: String,
            okReturnValue?: String,
            createSuccessHeader?: String,
            updateSuccessHeader?: String,
            createSuccess?: String,
            updateSuccess?: String,
            errorHeader?: String,
            updateError?: String,
            createError?: String
        };
        messages?: {
            name?: String,
            street?: String,
            zipCode?: String,
            city?: String,
            country?: String,
            notAssigned?: String
        };
        buttons?: {
            activatedTrue?: String,
            activatedFalse?: String
        };
    }
    export class TableComponent {
        id?: String;
        'Device ID'?: String;
        Type?: String;
        'Device Type'?: String;
        'Device Name'?: String;
        Manufacturer?: String;
        Fablab?: String;
        Description?: String;
        Comment?: String;
        'Created at'?: String;
        Projectname?: String;
        Owner?: String;
        Editor?: String;
        Status?: String;
        Username?: String;
        Firstname?: String;
        Lastname?: String;
        Role?: String;
        Active?: String;
        'Successful Orders'?: String;
        'Schedule Start Date'?: String;
        'Schedule End Date'?: String;
        Name?: String;
        City?: String;
        FOwner?: String;
    }
    export class LoginModal {
        title?: String;
        labels?: {
            username?: String,
            password?: String,
            login?: String,
            resetPassword?: String
        };
        modals?: {
            title?: String,
            inputLabel?: String,
            buttonLabel?: String,
            successHeader?: String,
            successMessage?: String,
            errorHeader?: String,
            errorMessage?: String
        };
    }
    export class ChangePasswdModal {
        title?: String;
        labels?: {
            oldPassword?: String,
            password?: String,
            password2?: String
        };
        modals?: {
            title?: String,
            buttonLabel?: String,
            successHeader?: String,
            successMessage?: String,
            errorHeader?: String,
            errorMessage?: String
        };
    }
}
