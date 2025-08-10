import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPricingRules, addPricingRule, updatePricingRule, deletePricingRule } from '../../features/pricingRules/pricingRulesSlice';
import PricingRulesTable from '../../features/pricingRules/components/PricingRulesTable';
import PricingRuleModal from '../../features/pricingRules/components/PricingRuleModal';

const ManagePricingRulesPage = () => {
  const dispatch = useDispatch();
  const { items: rules, loading, error } = useSelector((state) => state.pricingRules);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  const handleOpenModalForEdit = (rule) => {
    setRuleToEdit(rule);
    setIsModalOpen(true);
  };

  const handleOpenModalForAdd = () => {
    setRuleToEdit(null); // Ensure we're in "add" mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRuleToEdit(null);
  };

  const handleSubmit = (ruleData) => {
    if (ruleToEdit) {
      dispatch(updatePricingRule({ ruleId: ruleToEdit.rule_id, ruleData }));
    } else {
      dispatch(addPricingRule(ruleData));
    }
    handleCloseModal();
  };

  const handleDelete = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      dispatch(deletePricingRule(ruleId));
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ml-4">Manage Dynamic Pricing Rules</h1>
        <button className="btn btn-primary" onClick={handleOpenModalForAdd}>
          Add New Rule
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && <PricingRulesTable rules={rules} onEdit={handleOpenModalForEdit} onDelete={handleDelete} />}
      </div>

      <PricingRuleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={loading}
        ruleToEdit={ruleToEdit}
      />
    </div>
  );
};

export default ManagePricingRulesPage;
