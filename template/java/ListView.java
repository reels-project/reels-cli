package <%- packageName %>.view;

import java.io.Serializable;
import java.util.List;

import javax.faces.view.ViewScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import <%- packageName %>.model.<%-targetName2%>Model;

@ViewScoped
@Named
@SuppressWarnings("serial")
public class <%-targetName2%>ListView implements Serializable{
	
	@PersistenceContext
	private EntityManager em;
	
	private List<<%-targetName2%>Model> <%-targetName%>Models;
	
	public List<<%-targetName2%>Model> get<%-targetName2%>Models(){
		if(<%-targetName%>Models == null){
			<%-targetName%>Models = em.createQuery("select s from <%-targetName2%>Model s",<%-targetName2%>Model.class).getResultList();
		}
		return <%-targetName%>Models;
	}
	
	@Transactional
	public String delete(Long id){
		<%-targetName2%>Model model = em.find(<%-targetName2%>Model.class, id);
		em.remove(model);
		
		return "/views/<%-targetName%>/list.xhtml?faces-redirect=true";
	}
}
